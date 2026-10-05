// Builds the playable Kilobyte demo into public/kilobyte/ so it deploys with the
// portfolio at https://njoku.dev/kilobyte/. The output is committed, so run this
// again whenever Kilobyte changes:
//
//   npm run kilobyte                               # latest main from GitHub
//   KILOBYTE_REF=<sha|tag|branch> npm run kilobyte
//   KILOBYTE_DIR=../KiloByte npm run kilobyte      # a local checkout (committed HEAD)
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = '/kilobyte/';
const outDir = join(root, 'public', 'kilobyte');
const patch = join(root, 'scripts', 'kilobyte-subpath.patch');
const localDir = process.env.KILOBYTE_DIR ? resolve(process.env.KILOBYTE_DIR) : undefined;
const source = localDir ?? process.env.KILOBYTE_REPO ?? 'https://github.com/michaelnjoku347/KiloByte.git';
const ref = process.env.KILOBYTE_REF ?? 'main';

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const read = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();

const work = mkdtempSync(join(tmpdir(), 'kilobyte-'));
const modules = join(work, 'node_modules');
let linkedModules = false;

try {
  run('git', ['clone', '--quiet', source, work]);
  run('git', ['checkout', '--quiet', ref], work);
  const commit = read('git', ['rev-parse', '--short', 'HEAD'], work);

  // Upstream Kilobyte assumes it is served from "/". Skip the patch once it reads Vite's base itself.
  const baseAware = readFileSync(join(work, 'src/lib/idb.ts'), 'utf8').includes('BASE_URL');
  if (!baseAware) run('git', ['apply', patch], work);

  if (localDir && existsSync(join(localDir, 'node_modules'))) {
    symlinkSync(join(localDir, 'node_modules'), modules, 'dir');
    linkedModules = true;
  } else {
    run('npm', ['ci', '--no-audit', '--no-fund'], work);
  }

  run('npx', ['vite', 'build', '--base', base, '--outDir', 'dist', '--emptyOutDir'], work);

  rmSync(outDir, { recursive: true, force: true });
  cpSync(join(work, 'dist'), outDir, { recursive: true });
  console.log(`\nKilobyte ${commit} → public/kilobyte (served at ${base})`);
} finally {
  if (linkedModules) unlinkSync(modules);
  rmSync(work, { recursive: true, force: true });
}
