// Unit-test runner for Kree component classes.
//
// 1. Installs a CommonJS resolve hook so that any `@angular/*` import
//    hits our local stubs instead of the real framework — we do not
//    want Angular's runtime for branch-coverage tests.
// 2. Bridges in tsx/cjs so that .ts source files can be require()'d.
// 3. Requires each test file in tests-baseline/unit/. Each test file
//    runs a set of `test(name, fn)` cases and reports results.
//
// Run with:
//     node tests-baseline/unit-runner.cjs
// Or with c8 for branch coverage:
//     ./node_modules/.bin/c8 ... node tests-baseline/unit-runner.cjs

'use strict';

const path = require('path');
const Module = require('module');

const STUB_DIR = path.join(__dirname, 'stubs');
const STUB_MAP = {
  '@angular/core':                         path.join(STUB_DIR, 'angular-core.cjs'),
  '@angular/common':                       path.join(STUB_DIR, 'angular-common.cjs'),
  '@angular/common/http':                  path.join(STUB_DIR, 'angular-http.cjs'),
  '@angular/forms':                        path.join(STUB_DIR, 'angular-forms.cjs'),
  '@angular/platform-browser':             path.join(STUB_DIR, 'angular-common.cjs'),
  '@angular/platform-browser/animations':  path.join(STUB_DIR, 'angular-common.cjs'),
  '@angular/platform-browser-dynamic':     path.join(STUB_DIR, 'angular-common.cjs'),
  '@angular/router':                       path.join(STUB_DIR, 'angular-router.cjs'),
  '@angular/animations':                   path.join(STUB_DIR, 'angular-common.cjs'),
};

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (Object.prototype.hasOwnProperty.call(STUB_MAP, request)) {
    return STUB_MAP[request];
  }
  return origResolve.call(this, request, ...rest);
};

// Register tsx so that .ts files can be require()'d.
require('tsx/cjs');

// ---- Minimal test harness ----------------------------------------------

const tests = [];
global.__registerTest = function (name, fn) {
  tests.push({ name, fn });
};

// localStorage + matchMedia + document + window shims (Node has none of these).
const storage = (() => {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    removeItem: (k) => { data.delete(k); },
    clear: () => { data.clear(); },
  };
})();

const attrs = new Map();
global.document = {
  documentElement: {
    setAttribute: (k, v) => { attrs.set(k, v); },
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
  },
  body: { classList: { add: () => {}, remove: () => {} } },
};
global.window = {
  innerWidth: 1024,
  matchMedia: (_query) => ({ matches: false }),
};
global.localStorage = storage;
global.__attrs = attrs;

// ---- Discover + run tests ----------------------------------------------

const testFiles = [
  './unit/theme.service.test.ts',
  './unit/this-moment.component.test.ts',
  './unit/question.component.test.ts',
  './unit/your-name.component.test.ts',
  './unit/typeaway.component.test.ts',
  './unit/drop-bomb.component.test.ts',
  './unit/pledge.component.test.ts',
  './unit/donation-wizard.component.test.ts',
  './unit/kree.component.test.ts',
  './unit/auth.component.test.ts',
  './unit/dashboard.component.test.ts',
  './unit/landing.component.test.ts',
  './unit/pledge-page.component.test.ts',
];

for (const rel of testFiles) {
  require(path.join(__dirname, rel));
}

(async () => {
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const t of tests) {
    try {
      attrs.clear();
      storage.clear();
      await t.fn();
      passed++;
      console.log('  ✔', t.name);
    } catch (err) {
      failed++;
      failures.push({ name: t.name, err });
      console.log('  ✘', t.name);
      console.log('   ', err && err.stack ? err.stack.split('\n').slice(0, 4).join('\n    ') : err);
    }
  }

  console.log();
  console.log(`Tests: ${passed} passed, ${failed} failed, ${tests.length} total`);
  if (failed > 0) {
    process.exitCode = 1;
  }
})();
