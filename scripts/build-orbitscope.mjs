// Builds the playable OrbitScope demo into public/orbitscope/. Cubelight is the
// WASM ray tracer that ships inside the OrbitScope repo (tracer/web). The
// Cesium globe needs the Java API, so this hosted demo is Cubelight under the
// OrbitScope project path. Commit the output after running:
//
//   npm run orbitscope                               # latest OrbitScope main
//   ORBITSCOPE_DIR=../OrbitScope npm run orbitscope  # a local checkout
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = '/orbitscope/';
const outDir = join(root, 'public', 'orbitscope');
const localDir = process.env.ORBITSCOPE_DIR ? resolve(process.env.ORBITSCOPE_DIR) : undefined;
const source = localDir ?? process.env.ORBITSCOPE_REPO ?? 'https://github.com/michaelnjoku347/OrbitScope.git';
const ref = process.env.ORBITSCOPE_REF ?? 'main';

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const read = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();

const work = localDir ?? mkdtempSync(join(tmpdir(), 'orbitscope-'));
let cloned = false;

try {
  if (!localDir) {
    run('git', ['clone', '--quiet', source, work]);
    run('git', ['checkout', '--quiet', ref], work);
    cloned = true;
  }
  const commit = read('git', ['rev-parse', '--short', 'HEAD'], work);
  const web = join(work, 'tracer', 'web');
  for (const file of ['index.html', 'style.css', 'app.js', 'cubelight.wasm']) {
    readFileSync(join(web, file)); // throw if missing
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(web, outDir, { recursive: true });

  const htmlPath = join(outDir, 'index.html');
  let html = readFileSync(htmlPath, 'utf8');
  html = html
    .replace(/<title>Cubelight<\/title>/, '<title>OrbitScope · Cubelight</title>')
    .replace(/<h1>Cubelight<\/h1>/, '<h1>OrbitScope</h1>')
    .replace(
      /<p>A ray tracer in WASM\.[^<]*<\/p>/,
      '<p>Cubelight — the WASM ray tracer in this project. Three cubes, a lamp, and the switches for how the picture is made.</p>',
    )
    .replace(
      /<p>A ray tracer in WASM from OrbitScope\.[^<]*<\/p>/,
      '<p>Cubelight — the WASM ray tracer in this project. Three cubes, a lamp, and the switches for how the picture is made.</p>',
    );
  if (!html.includes('rel="icon"')) {
    html = html.replace('</title>', '</title>\n  <link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  }
  writeFileSync(htmlPath, html);
  writeFileSync(join(outDir, 'COMMIT.txt'), `${commit}\n`);
  console.log(`\nOrbitScope ${commit} → public/orbitscope (served at ${base})`);
} finally {
  if (cloned) rmSync(work, { recursive: true, force: true });
}
