// Renders public/og.png (the link-preview card) and public/apple-touch-icon.png.
// Run after changing the headline or the favicon: npm run images
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { findChrome } from './lib/chrome.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const file = (path) => new URL(path, `file://${root}/`);
const font = (path) => `data:font/woff2;base64,${readFileSync(file(`node_modules/${path}`)).toString('base64')}`;

const display = font('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2');
const body = font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const mono = font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2');

const pins = ['JAVA', 'PYTHON', 'LUA', 'JAVASCRIPT', 'HTML', 'MYSQL', 'GODOT', 'GIT'];
const pinY = [118, 188, 258, 328];
const chip = `
<svg viewBox="0 0 520 446" width="520" height="446" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2d33"/><stop offset="1" stop-color="#0d0e10"/></linearGradient>
    <linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7e9ed"/><stop offset="1" stop-color="#6f747d"/></linearGradient>
  </defs>
  ${pinY
    .map(
      (y, i) => `
    <path d="M150 ${y} H12" stroke="#6f4a24" stroke-width="4" stroke-linecap="round"/>
    <path d="M370 ${y} H508" stroke="#6f4a24" stroke-width="4" stroke-linecap="round"/>
    <path d="M150 ${y} H${i % 2 ? 60 : 96}" stroke="#ffd884" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <circle cx="12" cy="${y}" r="7" fill="#d8b56d"/><circle cx="508" cy="${y}" r="7" fill="#d8b56d"/>
    <text x="28" y="${y - 12}" class="pin">${pins[i]}</text>
    <text x="492" y="${y - 12}" class="pin" text-anchor="end">${pins[i + 4]}</text>
    <rect x="148" y="${y - 8}" width="30" height="16" rx="3" fill="url(#m)"/>
    <rect x="342" y="${y - 8}" width="30" height="16" rx="3" fill="url(#m)"/>`,
    )
    .join('')}
  <path d="M190 62 H242 A18 18 0 0 0 278 62 H330 Q344 62 344 76 V370 Q344 384 330 384 H190 Q176 384 176 370 V76 Q176 62 190 62 Z" fill="url(#g)" stroke="#2a2c31" stroke-width="2"/>
  <circle cx="200" cy="88" r="7" fill="#0a0b0d" stroke="#2b2e34"/>
  <text x="260" y="222" text-anchor="middle" class="mark">MN</text>
  <text x="260" y="258" text-anchor="middle" class="code">CS · 2029</text>
</svg>`;

const html = `<!doctype html>
<html><head><style>
  @font-face { font-family: Display; src: url(${display}) format('woff2'); font-weight: 200 800; }
  @font-face { font-family: Body; src: url(${body}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: Mono; src: url(${mono}) format('woff2'); font-weight: 100 800; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0b0c0f; color: #eceef1; font-family: Body; }
  .frame { position: relative; width: 100%; height: 100%; padding: 64px 0 64px 72px; display: flex; align-items: center;
    background:
      radial-gradient(520px 420px at 82% 46%, rgb(255 160 40 / 0.2), transparent 70%),
      radial-gradient(circle, rgb(255 255 255 / 0.06) 1px, transparent 1.4px) 0 0 / 22px 22px; }
  .copy { width: 640px; flex: none; }
  .site { font-family: Mono; font-size: 26px; font-weight: 600; letter-spacing: -0.01em; }
  .site span { color: #ffc45a; }
  h1 { margin-top: 40px; font-family: Display; font-size: 92px; font-weight: 700; line-height: 0.95; letter-spacing: -0.045em; }
  p.lede { margin-top: 26px; font-family: Display; font-size: 40px; font-weight: 600; line-height: 1.12; letter-spacing: -0.025em; color: #c9cdd4; }
  .hl { background: linear-gradient(100deg, #ffb224, #ff7a1a); -webkit-background-clip: text; color: transparent; }
  .meta { margin-top: 44px; display: flex; gap: 14px; font-family: Mono; font-size: 19px; color: #a9aeb8; }
  .meta b { color: #3ee089; font-weight: 600; }
  .board { position: absolute; right: -36px; top: 92px; padding: 0; border-radius: 32px; background: #08110d;
    background-image: radial-gradient(circle, rgb(170 255 215 / 0.08) 1.2px, transparent 1.4px); background-size: 18px 18px;
    border: 1px solid rgb(170 255 215 / 0.14); box-shadow: 0 40px 90px -30px rgb(0 0 0 / 0.9); width: 600px; height: 446px;
    display: grid; place-items: center; }
  .pin { fill: rgb(232 244 238 / 0.72); font-family: Mono; font-size: 15px; font-weight: 500; letter-spacing: 0.08em; }
  .mark { fill: rgb(230 233 238 / 0.92); font-family: Display; font-size: 84px; font-weight: 700; letter-spacing: -0.04em; }
  .code { fill: #ffb224; font-family: Mono; font-size: 14px; font-weight: 600; letter-spacing: 0.28em; }
</style></head>
<body><div class="frame">
  <div class="copy">
    <div class="site">njoku<span>.dev</span></div>
    <h1>Michael Njoku</h1>
    <p class="lede">I build where <span class="hl">hardware</span><br>meets <span class="hl">software</span>.</p>
    <div class="meta"><b>●</b> CS @ Farmingdale State · Class of 2029</div>
  </div>
  <div class="board">${chip}</div>
</div></body></html>`;

const browser = await puppeteer.launch({ executablePath: findChrome(), args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(fileURLToPath(file('public/og.png')));
  console.log('Wrote public/og.png');
} finally {
  await browser.close();
}

// iOS masks the icon itself, so render it full-bleed without the rounded corners.
const favicon = readFileSync(file('public/favicon.svg'), 'utf8').replace('rx="14"', 'rx="0"');
await sharp(Buffer.from(favicon), { density: 600 })
  .resize(180, 180)
  .png()
  .toFile(fileURLToPath(file('public/apple-touch-icon.png')));
console.log('Wrote public/apple-touch-icon.png');
