#!/usr/bin/env node
// Orchestrator: runs the unit tests (coverage) + the Puppeteer e2e
// tests end-to-end, writes results to tests-baseline/, and prints
// a combined summary.
//
// Usage:
//   node tests-baseline/run.js              # unit + puppeteer
//   node tests-baseline/run.js --unit-only
//   node tests-baseline/run.js --e2e-only

'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const unitOnly = args.includes('--unit-only');
const e2eOnly = args.includes('--e2e-only');

function run(label, cmd, cmdArgs, opts = {}) {
  console.log();
  console.log('════', label);
  const r = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: 'inherit',
    ...opts,
  });
  return r.status || 0;
}

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

let failures = 0;

if (!e2eOnly) {
  // 1. Unit tests under c8 → coverage-final.json
  const c8 = path.join(ROOT, 'node_modules', '.bin', 'c8');
  const status1 = run(
    'Unit tests (c8 + tsx)',
    c8,
    [
      '--reporter=json',
      '--reporter=text-summary',
      '--report-dir=tests-baseline/coverage',
      '--include=src/app/kree/**/*.ts',
      '--all',
      '--src=src',
      'node',
      'tests-baseline/unit-runner.cjs',
    ],
  );
  if (status1 !== 0) failures++;

  // 2. Filter + summary
  const status2 = run(
    'Filtered developer-branch coverage',
    'node',
    ['tests-baseline/coverage-report.cjs'],
  );
  if (status2 !== 0) failures++;
}

if (!unitOnly) {
  // 3. Build the Angular production bundle (if not already there).
  const distIndex = path.join(ROOT, 'dist', 'client', 'index.html');
  if (!exists(distIndex)) {
    const ng = path.join(ROOT, 'node_modules', '.bin', 'ng');
    const status3 = run('Building dist/client', ng, ['build', '--configuration', 'production']);
    if (status3 !== 0) {
      console.error('build failed, skipping puppeteer');
      process.exit(status3);
    }
  }

  // 4. Puppeteer e2e smoke tests
  const status4 = run(
    'Puppeteer e2e smoke tests',
    'node',
    ['tests-baseline/e2e/puppeteer-smoke.cjs'],
  );
  if (status4 !== 0) failures++;
}

console.log();
if (failures > 0) {
  console.log(`${failures} phase(s) failed`);
  process.exit(1);
}
console.log('All phases passed.');
