// Builds the playable Agent Allowance demo into public/agent-allowance/.
// The dashboard is static; scripts/agent-allowance-portfolio-mock.js answers
// /api/* in the browser so Run agent, approvals, freeze, and Eve work without
// a Node server. Commit the output after running:
//
//   npm run agent-allowance
//   AGENT_ALLOWANCE_DIR=../Agent-allowance npm run agent-allowance
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = '/agent-allowance/';
const outDir = join(root, 'public', 'agent-allowance');
const mockSrc = join(root, 'scripts', 'agent-allowance-portfolio-mock.js');
const localDir = process.env.AGENT_ALLOWANCE_DIR ? resolve(process.env.AGENT_ALLOWANCE_DIR) : undefined;
const source = localDir ?? process.env.AGENT_ALLOWANCE_REPO ?? 'https://github.com/michaelnjoku347/Agent-allowance.git';
const ref = process.env.AGENT_ALLOWANCE_REF ?? 'main';

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const read = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();

const work = localDir ?? mkdtempSync(join(tmpdir(), 'agent-allowance-'));
let cloned = false;

try {
  if (!localDir) {
    run('git', ['clone', '--quiet', source, work]);
    run('git', ['checkout', '--quiet', ref], work);
    cloned = true;
  }
  const commit = read('git', ['rev-parse', '--short', 'HEAD'], work);
  const dashboard = join(work, 'dashboard');

  run('npm', ['ci', '--no-audit', '--no-fund'], dashboard);
  run('npx', ['vite', 'build', '--base', base, '--outDir', 'dist', '--emptyOutDir'], dashboard);

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(join(dashboard, 'dist'), outDir, { recursive: true });
  cpSync(mockSrc, join(outDir, 'portfolio-mock.js'));

  const htmlPath = join(outDir, 'index.html');
  let html = readFileSync(htmlPath, 'utf8');
  if (!html.includes('portfolio-mock.js')) {
    html = html.replace(
      /<script type="module"/,
      `<script src="${base}portfolio-mock.js"></script>\n    <script type="module"`,
    );
  }
  writeFileSync(htmlPath, html);
  writeFileSync(join(outDir, 'COMMIT.txt'), `${commit}\n`);
  console.log(`\nAgent Allowance ${commit} → public/agent-allowance (served at ${base})`);
} finally {
  if (cloned) rmSync(work, { recursive: true, force: true });
}
