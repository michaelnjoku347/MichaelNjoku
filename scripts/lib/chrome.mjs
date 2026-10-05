import { existsSync } from 'node:fs';

const candidates = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/local/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

export function findChrome() {
  const found = candidates.find((path) => path && existsSync(path));
  if (!found) throw new Error('Could not find Chrome. Set CHROME_PATH to a Chrome or Chromium binary.');
  return found;
}
