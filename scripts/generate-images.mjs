// Renders public/og.png (the link-preview card) and public/apple-touch-icon.png.
// Run after changing the photo, name, or favicon: npm run images
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { findChrome } from './lib/chrome.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const file = (path) => new URL(path, `file://${root}/`);
const font = (path) => `data:font/woff2;base64,${readFileSync(file(`node_modules/${path}`)).toString('base64')}`;
const photo = `data:image/jpeg;base64,${readFileSync(file('src/assets/michael.jpg')).toString('base64')}`;

const display = font('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2');
const body = font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const mono = font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2');

const html = `<!doctype html>
<html><head><style>
  @font-face { font-family: Display; src: url(${display}) format('woff2'); font-weight: 200 800; }
  @font-face { font-family: Body; src: url(${body}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: Mono; src: url(${mono}) format('woff2'); font-weight: 100 800; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0b0c0f; color: #eceef1; font-family: Body; }
  .frame { position: relative; width: 100%; height: 100%; padding: 64px 72px; display: flex; align-items: center; justify-content: space-between;
    background:
      radial-gradient(520px 420px at 82% 46%, rgb(255 160 40 / 0.22), transparent 70%),
      radial-gradient(circle, rgb(255 255 255 / 0.06) 1px, transparent 1.4px) 0 0 / 22px 22px; }
  .copy { width: 640px; flex: none; }
  .site { font-family: Mono; font-size: 26px; font-weight: 600; letter-spacing: -0.01em; }
  .site span { color: #ffc45a; }
  h1 { margin-top: 36px; font-family: Display; font-size: 92px; font-weight: 700; line-height: 0.95; letter-spacing: -0.045em; }
  p.lede { margin-top: 22px; font-size: 28px; font-weight: 500; line-height: 1.35; color: #c9cdd4; max-width: 18ch; }
  .meta { margin-top: 40px; display: flex; gap: 14px; font-family: Mono; font-size: 19px; color: #a9aeb8; }
  .meta b { color: #3ee089; font-weight: 600; }
  .photo { width: 340px; height: 340px; padding: 8px; border-radius: 50%; background: conic-gradient(from 210deg, #ffb224, #ff7a1a, #ffb224);
    box-shadow: 0 40px 90px -30px rgb(0 0 0 / 0.9); }
  .photo img { width: 100%; height: 100%; border: 8px solid #13161b; border-radius: 50%; object-fit: cover; }
</style></head>
<body><div class="frame">
  <div class="copy">
    <div class="site">njoku<span>.dev</span></div>
    <h1>Michael Njoku</h1>
    <p class="lede">Computer Science student &amp; developer.</p>
    <div class="meta"><b>●</b> Farmingdale State · Class of 2029</div>
  </div>
  <div class="photo"><img src="${photo}" alt=""></div>
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

const favicon = readFileSync(file('public/favicon.svg'), 'utf8').replace('rx="14"', 'rx="0"');
await sharp(Buffer.from(favicon), { density: 600 })
  .resize(180, 180)
  .png()
  .toFile(fileURLToPath(file('public/apple-touch-icon.png')));
console.log('Wrote public/apple-touch-icon.png');
