// Builds the OrbitScope portfolio demo into public/orbitscope/:
//   /orbitscope/           → Cesium globe (frozen CelesTrak snapshot)
//   /orbitscope/cubelight/ → Cubelight WASM ray tracer from the same repo
//
//   npm run orbitscope
//   ORBITSCOPE_DIR=../OrbitScope npm run orbitscope
//   ORBITSCOPE_REFRESH=1 npm run orbitscope   # re-dump fixtures from a live API
import { execFileSync, spawn } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = '/orbitscope/';
const outDir = join(root, 'public', 'orbitscope');
const fixtureDir = join(root, 'scripts', 'orbitscope-data');
const mockSrc = join(root, 'scripts', 'orbitscope-portfolio-mock.js');
const localDir = process.env.ORBITSCOPE_DIR ? resolve(process.env.ORBITSCOPE_DIR) : undefined;
const source = localDir ?? process.env.ORBITSCOPE_REPO ?? 'https://github.com/michaelnjoku347/OrbitScope.git';
const ref = process.env.ORBITSCOPE_REF ?? 'main';
const refresh = process.env.ORBITSCOPE_REFRESH === '1';

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const read = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();

async function refreshFixtures(work) {
  mkdirSync(fixtureDir, { recursive: true });
  console.log('Refreshing OrbitScope fixtures from a live API…');
  run('./mvnw', ['-q', '-DskipTests', 'package'], work);
  const child = spawn('./mvnw', ['-q', '-DskipTests', 'spring-boot:run'], {
    cwd: work,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (chunk) => {
    log += chunk;
  });
  child.stderr.on('data', (chunk) => {
    log += chunk;
  });
  try {
    let ready = false;
    for (let i = 0; i < 90; i++) {
      try {
        const res = await fetch('http://127.0.0.1:8080/satellites');
        if (res.ok) {
          ready = true;
          break;
        }
      } catch {
        /* waiting */
      }
      if (child.exitCode != null) throw new Error(`OrbitScope API exited early:\n${log.slice(-2000)}`);
      await sleep(5000);
    }
    if (!ready) throw new Error(`OrbitScope API did not become ready:\n${log.slice(-2000)}`);

    const catalog = await (await fetch('http://127.0.0.1:8080/satellites')).json();
    const compact = await (await fetch('http://127.0.0.1:8080/satellites/positions/compact')).json();
    const passes = await (await fetch('http://127.0.0.1:8080/satellites/25544/passes')).json();
    for (const key of ['latitude', 'longitude', 'altitudeKm']) {
      compact[key] = compact[key].map((n) => Math.round(Number(n) * 10000) / 10000);
    }
    writeFileSync(join(fixtureDir, 'catalog.json'), JSON.stringify(catalog));
    writeFileSync(join(fixtureDir, 'compact.json'), JSON.stringify(compact));
    writeFileSync(join(fixtureDir, 'passes-25544.json'), JSON.stringify(passes));
    writeFileSync(
      join(fixtureDir, 'meta.json'),
      JSON.stringify(
        {
          capturedAt: compact.time,
          satelliteCount: compact.count,
          note: 'Frozen snapshot for the njoku.dev OrbitScope demo.',
        },
        null,
        2,
      ),
    );
    console.log(`Captured ${compact.count} satellites at ${compact.time}`);
  } finally {
    child.kill('SIGTERM');
    await sleep(1000);
    if (child.exitCode == null) child.kill('SIGKILL');
  }
}

const work = localDir ?? mkdtempSync(join(tmpdir(), 'orbitscope-'));
let cloned = false;

try {
  if (!localDir) {
    run('git', ['clone', '--quiet', source, work]);
    run('git', ['checkout', '--quiet', ref], work);
    cloned = true;
  }
  const commit = read('git', ['rev-parse', '--short', 'HEAD'], work);

  if (refresh || !existsSync(join(fixtureDir, 'compact.json'))) {
    await refreshFixtures(work);
  }

  const web = join(work, 'web');
  run('npm', ['ci', '--no-audit', '--no-fund'], web);
  run('npx', ['vite', 'build', '--base', base, '--outDir', 'dist', '--emptyOutDir'], web);

  const tracerWeb = join(work, 'tracer', 'web');
  for (const file of ['index.html', 'style.css', 'app.js', 'cubelight.wasm']) {
    readFileSync(join(tracerWeb, file));
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // Vite+cesium with base /orbitscope/ writes assets at dist/assets and Cesium at dist/orbitscope/cesium.
  cpSync(join(web, 'dist', 'index.html'), join(outDir, 'index.html'));
  cpSync(join(web, 'dist', 'assets'), join(outDir, 'assets'), { recursive: true });
  const cesiumSrc = join(web, 'dist', 'orbitscope', 'cesium');
  if (!existsSync(cesiumSrc)) throw new Error(`Cesium assets missing at ${cesiumSrc}`);
  cpSync(cesiumSrc, join(outDir, 'cesium'), { recursive: true });

  mkdirSync(join(outDir, 'data'), { recursive: true });
  cpSync(fixtureDir, join(outDir, 'data'), { recursive: true });
  cpSync(mockSrc, join(outDir, 'portfolio-mock.js'));

  let html = readFileSync(join(outDir, 'index.html'), 'utf8');
  if (!html.includes('portfolio-mock.js')) {
    html = html.replace(
      /<script type="module"/,
      `<script src="${base}portfolio-mock.js"></script>\n    <script type="module"`,
    );
  }
  if (!html.includes('rel="icon"')) {
    html = html.replace('</title>', '</title>\n    <link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  }
  html = html.replace(
    '<div id="status" class="status">waiting on the api…</div>',
    '<div id="status" class="status">loading snapshot…</div>',
  );
  // Point visitors at Cubelight without leaving the OrbitScope project.
  if (!html.includes('/orbitscope/cubelight/')) {
    html = html.replace(
      '<div id="info" class="info">\n        <p>Click a satellite. Pass times are from New York.</p>\n      </div>',
      `<div id="info" class="info">
        <p>Click a satellite. Pass times are from New York.</p>
        <p style="margin-top:.75rem;opacity:.8">Also in this project: <a href="/orbitscope/cubelight/" style="color:#3ee0c3">Cubelight</a> — a WASM ray tracer.</p>
      </div>`,
    );
  }
  writeFileSync(join(outDir, 'index.html'), html);

  const cubelightDir = join(outDir, 'cubelight');
  mkdirSync(cubelightDir, { recursive: true });
  cpSync(tracerWeb, cubelightDir, { recursive: true });
  let cubeHtml = readFileSync(join(cubelightDir, 'index.html'), 'utf8');
  cubeHtml = cubeHtml
    .replace(/<title>Cubelight<\/title>/, '<title>OrbitScope · Cubelight</title>')
    .replace(/<h1>Cubelight<\/h1>/, '<h1>OrbitScope</h1>')
    .replace(
      /<p>A ray tracer in WASM[^<]*<\/p>/,
      '<p>Cubelight — the WASM ray tracer in this project. Three cubes, a lamp, and the switches for how the picture is made.</p>',
    );
  if (!cubeHtml.includes('rel="icon"')) {
    cubeHtml = cubeHtml.replace('</title>', '</title>\n  <link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  }
  if (!cubeHtml.includes('Back to the globe')) {
    cubeHtml = cubeHtml.replace(
      '<div class="top-actions">',
      `<div class="top-actions">
        <a class="ghost" href="/orbitscope/" style="display:inline-flex;align-items:center;text-decoration:none;padding:.4rem .75rem">← Globe</a>`,
    );
  }
  writeFileSync(join(cubelightDir, 'index.html'), cubeHtml);

  writeFileSync(join(outDir, 'COMMIT.txt'), `${commit}\n`);
  console.log(`\nOrbitScope ${commit} → public/orbitscope (globe + cubelight at ${base})`);
} finally {
  if (cloned) rmSync(work, { recursive: true, force: true });
}
