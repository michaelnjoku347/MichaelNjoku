// Loads the production build in Chrome and checks the things that matter:
// every page renders without errors, internal links resolve, the theme and
// command menu work, and the Kilobyte demo plays from /kilobyte/.
//
//   npm run build && npm run smoke        (screenshots land in .smoke/)
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/chrome.mjs';
import { serve } from './lib/serve.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const shots = `${root}.smoke`;
mkdirSync(shots, { recursive: true });

const server = await serve(`${root}dist`);
const browser = await puppeteer.launch({ executablePath: findChrome(), args: ['--no-sandbox'] });
const failures = [];
const links = new Set();

const check = (ok, message) => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${message}`);
  if (!ok) failures.push(message);
};

async function open(path, { width = 1440, height = 900, mobile = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(server.origin)) errors.push(`${request.failure()?.errorText}: ${request.url()}`);
  });
  page.on('response', (response) => {
    const url = response.url();
    if (url.startsWith(server.origin) && response.status() >= 400 && url !== `${server.origin}${path}`) {
      errors.push(`${response.status()}: ${url}`);
    }
  });
  const response = await page.goto(`${server.origin}${path}`, { waitUntil: 'networkidle0' });
  return { page, errors, status: response?.status() ?? 0 };
}

async function revealAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function collectLinks(page) {
  const hrefs = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.href));
  for (const href of hrefs) {
    const url = new URL(href);
    if (url.origin === server.origin) links.add(url.pathname);
  }
  const missing = await page.$$eval('a[href^="#"]', (anchors) =>
    anchors
      .map((a) => a.getAttribute('href').slice(1))
      .filter((id) => id && !document.getElementById(id)),
  );
  check(missing.length === 0, `in-page anchors resolve${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`);
}

try {
  for (const [path, name] of [
    ['/', 'home'],
    ['/projects/', 'projects'],
    ['/projects/kilobyte/', 'kilobyte-case-study'],
    ['/projects/njoku-dev/', 'njoku-dev'],
    ['/resume/', 'resume'],
    ['/contact/thanks/', 'contact-thanks'],
  ]) {
    console.log(`\n${path}`);
    const { page, errors, status } = await open(path);
    check(status === 200, `responds 200 (got ${status})`);
    check(!(await page.content()).includes('michaeln2029@'), `${path} does not include a personal email`);
    await collectLinks(page);
    await revealAll(page);
    await page.screenshot({ path: `${shots}/${name}-desktop.png`, fullPage: true });

    if (path === '/') {
      check((await page.$eval('h1', (h1) => h1.textContent)).includes('Michael Njoku'), 'hero shows your name');
      const demoLinks = await page.$$('#projects a[href="/kilobyte/"]');
      check(demoLinks.length >= 2, `Projects links to the Kilobyte demo (${demoLinks.length} links)`);
      check(Boolean(await page.$('#contact a[href*="linkedin.com"]')), 'contact points visitors to LinkedIn until a form key is set');

      const before = await page.$eval('html', (html) => html.dataset.theme);
      await page.click('[data-theme-toggle]');
      await new Promise((resolve) => setTimeout(resolve, 800));
      const after = await page.$eval('html', (html) => html.dataset.theme);
      check(before !== after, `theme toggle switches ${before} → ${after}`);
      await page.screenshot({ path: `${shots}/home-${after}-hero.png` });
      await page.click('[data-theme-toggle]');
      await new Promise((resolve) => setTimeout(resolve, 800));

      await page.keyboard.down('Control');
      await page.keyboard.press('k');
      await page.keyboard.up('Control');
      check(await page.$eval('[data-palette]', (dialog) => dialog.open), 'Ctrl+K opens the command menu');
      await page.keyboard.type('kilo');
      const matches = await page.$$eval('[data-palette-item]:not([hidden])', (items) => items.map((i) => i.dataset.label));
      check(matches[0] === 'Play the Kilobyte demo', `command menu filters to Kilobyte (${matches.join(', ')})`);
      await page.screenshot({ path: `${shots}/home-palette.png` });
      await page.keyboard.press('Escape');
      check(!(await page.$eval('[data-palette]', (dialog) => dialog.open)), 'Escape closes the command menu');
    }

    if (path === '/projects/kilobyte/') {
      await page.click('[data-demo-load]');
      const frame = await page.waitForSelector('.demo-frame');
      const content = await (await frame.contentFrame()).waitForSelector('#root > *', { timeout: 10_000 });
      check(Boolean(content), 'embedded demo loads inside the case study');
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await page.screenshot({ path: `${shots}/kilobyte-case-study-demo.png` });
      const tabs = await page.$$('[role="tab"]');
      await tabs[2].click();
      check(
        await page.$eval('#panel-play', (panel) => !panel.hidden),
        'tour tabs switch screenshots',
      );
    }

    check(errors.length === 0, `no console or network errors${errors.length ? `:\n      ${errors.join('\n      ')}` : ''}`);
    await page.close();
  }

  console.log('\n/kilobyte/ (demo)');
  {
    const { page, errors, status } = await open('/kilobyte/');
    check(status === 200, `responds 200 (got ${status})`);
    await page.waitForSelector('#root > *');
    check((await page.title()).includes('Kilobyte'), 'Kilobyte app boots');

    const worker = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
      }
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('kilobyte.bundles.v1', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('bundles');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const put = (value) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction('bundles', 'readwrite');
          if (value) tx.objectStore('bundles').put(value, 'smoke-test');
          else tx.objectStore('bundles').delete('smoke-test');
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
        });
      await put({ 'index.html': { data: '<h1>uploaded</h1>', type: 'text/html' } });
      const response = await fetch('/kilobyte/local-game/smoke-test/index.html');
      const text = await response.text();
      await put(null);
      return { scope: registration.scope, status: response.status, text };
    });
    check(worker.scope === `${server.origin}/kilobyte/`, `service worker is scoped to /kilobyte/ (${worker.scope})`);
    check(worker.status === 200 && worker.text.includes('uploaded'), 'uploaded games are served by the worker');

    await page.goto(`${server.origin}/kilobyte/#/play/house_dock_ledger`, { waitUntil: 'networkidle0' });
    const src = await page.waitForSelector('iframe').then((frame) => frame.evaluate((el) => el.src));
    check(src.includes('/kilobyte/games/dock-ledger/'), `house games load from the demo folder (${new URL(src).pathname})`);
    const game = await page.evaluate((url) => fetch(url).then((r) => r.status), src);
    check(game === 200, 'house game file responds 200');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.screenshot({ path: `${shots}/kilobyte-demo-play.png` });
    check(errors.length === 0, `no console or network errors${errors.length ? `:\n      ${errors.join('\n      ')}` : ''}`);
    await page.close();
  }

  console.log('\n404');
  {
    const { page, status } = await open('/no-such-page/');
    check(status === 404, `missing pages return 404 (got ${status})`);
    check((await page.content()).includes('This page doesn’t exist'), 'custom 404 page renders');
    await page.screenshot({ path: `${shots}/404-desktop.png` });
    await page.close();
  }

  console.log('\nmobile');
  for (const [path, name] of [
    ['/', 'home'],
    ['/projects/', 'projects'],
    ['/projects/kilobyte/', 'kilobyte-case-study'],
    ['/resume/', 'resume'],
  ]) {
    const { page, errors } = await open(path, { width: 390, height: 844, mobile: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${path} has no sideways scroll at 390px (${overflow}px)`);
    if (path === '/') {
      await page.click('[data-menu-toggle]');
      check(await page.$eval('[data-mobile-menu]', (menu) => !menu.hidden), 'mobile menu opens');
      await page.screenshot({ path: `${shots}/home-mobile-menu.png` });
      await page.click('[data-menu-toggle]');
    }
    await revealAll(page);
    await page.screenshot({ path: `${shots}/${name}-mobile.png`, fullPage: true });
    check(errors.length === 0, `${path} has no errors on mobile`);
    await page.close();
  }

  console.log('\nlinks');
  for (const path of [...links].sort()) {
    const response = await fetch(`${server.origin}${path}`);
    check(response.status === 200, `${path} → ${response.status}`);
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll smoke checks passed. Screenshots are in .smoke/');
