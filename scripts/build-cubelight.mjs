// Builds the playable Cubelight demo into public/cubelight/ so it deploys with
// the portfolio at https://njoku.dev/cubelight/. The files are committed.
//
//   npm run cubelight                               # latest main from GitHub
//   CUBELIGHT_REF=<sha|tag|branch> npm run cubelight
//   ORBITSCOPE_DIR=../OrbitScope npm run cubelight  # a local checkout
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = '/cubelight/';
const outDir = join(root, 'public', 'cubelight');
const localDir = process.env.ORBITSCOPE_DIR ? resolve(process.env.ORBITSCOPE_DIR) : undefined;
const source = localDir ?? process.env.ORBITSCOPE_REPO ?? 'https://github.com/michaelnjoku347/OrbitScope.git';
const ref = process.env.CUBELIGHT_REF ?? process.env.ORBITSCOPE_REF ?? 'main';

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const read = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();

const work = localDir ?? mkdtempSync(join(tmpdir(), 'cubelight-'));
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
  if (!html.includes('njoku.dev')) {
    html = html.replace(
      '<p>A ray tracer in WASM. Three cubes, a lamp, and the switches for how the picture is made.</p>',
      '<p>A ray tracer in WASM from OrbitScope. Three cubes, a lamp, and the switches for how the picture is made.</p>',
    );
  }
  if (!html.includes('rel="icon"')) {
    html = html.replace('</title>', '</title>\n  <link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  }
  writeFileSync(htmlPath, html);
  writeFileSync(join(outDir, 'COMMIT.txt'), `${commit}\n`);
  console.log(`\nCubelight ${commit} → public/cubelight (served at ${base})`);
} finally {
  if (cloned) rmSync(work, { recursive: true, force: true });
}
