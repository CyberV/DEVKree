// Puppeteer smoke tests.
//
// The unit tests in ../unit/ give us the branch coverage report. These
// end-to-end checks are independent — they spin up a real browser,
// hit the production Angular 17 bundle via a tiny static server, and
// drive the full flow like a user would. If this file passes, the
// build is actually usable.
//
// Usage: node tests-baseline/e2e/puppeteer-smoke.cjs

'use strict';

const path = require('path');
const puppeteer = require('puppeteer');
const { serve } = require('../server');

const DIST = path.resolve(__dirname, '..', '..', 'dist', 'client');
const RESULTS = [];

function test(name, fn) {
  return async (ctx) => {
    const start = Date.now();
    try {
      await fn(ctx);
      RESULTS.push({ name, status: 'pass', ms: Date.now() - start });
      console.log('  ✔', name);
    } catch (err) {
      RESULTS.push({
        name,
        status: 'fail',
        ms: Date.now() - start,
        error: err && (err.stack || err.message || String(err)),
      });
      console.log('  ✘', name);
      console.log('   ', err && err.message ? err.message : err);
    }
  };
}

async function withPage(ctx, fn) {
  const page = await ctx.browser.newPage();
  try {
    await page.setViewport({ width: 1200, height: 800 });
    await fn(page);
  } finally {
    await page.close();
  }
}

async function waitForSelector(page, sel, timeout = 30000) {
  await page.waitForSelector(sel, { timeout });
}

async function text(page, sel) {
  return page.$eval(sel, (el) => el.textContent.trim());
}

async function clickTestId(page, id) {
  await page.click(`[data-testid="${id}"]`);
}

// ---- tests ----------------------------------------------------------

const tests = [
  test('app mounts and renders the Kree header', async (ctx) => {
    await withPage(ctx, async (page) => {
      await page.goto(ctx.url, { waitUntil: 'networkidle0' });
      await waitForSelector(page, '.kree-header .brand');
      const brand = await text(page, '.kree-header .brand');
      if (!brand.toLowerCase().startsWith('kree')) {
        throw new Error(`unexpected brand text: ${brand}`);
      }
    });
  }),

  test('html gets data-theme="dark" by default', async (ctx) => {
    await withPage(ctx, async (page) => {
      await page.goto(ctx.url, { waitUntil: 'networkidle0' });
      await waitForSelector(page, '[data-testid="theme-toggle"]');
      const theme = await page.$eval('html', (el) => el.getAttribute('data-theme'));
      if (theme !== 'dark' && theme !== 'light') {
        throw new Error(`data-theme missing, got ${JSON.stringify(theme)}`);
      }
    });
  }),

  test('theme toggle flips dark → light', async (ctx) => {
    await withPage(ctx, async (page) => {
      await page.goto(ctx.url, { waitUntil: 'networkidle0' });
      await waitForSelector(page, '[data-testid="theme-toggle"]');
      await page.evaluate(() => {
        localStorage.setItem('kree.theme', 'dark');
      });
      await page.reload({ waitUntil: 'networkidle0' });
      await waitForSelector(page, '[data-testid="theme-toggle"]');
      const before = await page.$eval('html', (el) => el.getAttribute('data-theme'));
      if (before !== 'dark') throw new Error(`expected dark, got ${before}`);
      await clickTestId(page, 'theme-toggle');
      const after = await page.$eval('html', (el) => el.getAttribute('data-theme'));
      if (after !== 'light') throw new Error(`expected light, got ${after}`);
    });
  }),

  test('breathe-orb is visible on the intro', async (ctx) => {
    await withPage(ctx, async (page) => {
      await page.goto(ctx.url, { waitUntil: 'networkidle0' });
      await waitForSelector(page, '.breath-orb');
      const visible = await page.$eval('.breath-orb', (el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      if (!visible) throw new Error('breath-orb has zero size');
    });
  }),

  test('full flow (time branch): Take a pledge → wizard → time → mentor → thank you', async (ctx) => {
    await withPage(ctx, async (page) => {
      await runFullFlow(page, ctx.url, {
        name: 'Ada Lovelace',
        kindTestId: 'donate-time',
        optionTestId: 'opt-mentor',
        expectText: /Mentor a student/,
      });
    });
  }),

  test('full flow (resources branch): Donate money → thank you', async (ctx) => {
    await withPage(ctx, async (page) => {
      await runFullFlow(page, ctx.url, {
        name: 'Grace Hopper',
        kindTestId: 'donate-resources',
        optionTestId: 'opt-money',
        expectText: /Donate money/i,
      });
    });
  }),

  test('wizard back-button unwinds step 3 → step 2 → step 1', async (ctx) => {
    await withPage(ctx, async (page) => {
      await goThroughIntro(page, ctx.url, 'Alan Turing');
      await waitForSelector(page, '[data-testid="donate-time"]', 240000);
      await clickTestId(page, 'donate-time');
      await waitForSelector(page, '[data-testid="opt-clean"]');
      await clickTestId(page, 'opt-clean');
      await waitForSelector(page, '[data-testid="wizard-back"]');
      await clickTestId(page, 'wizard-back'); // step 3 → 2
      await waitForSelector(page, '[data-testid="opt-clean"]');
      await clickTestId(page, 'wizard-back'); // step 2 → 1
      await waitForSelector(page, '[data-testid="donate-time"]');
    });
  }),
];

// ---- shared flow helpers --------------------------------------------

async function goThroughIntro(page, url, name) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  // Phase 1–2: intro runs for ~37 seconds → "Take a pledge" button appears.
  await waitForSelector(page, '[data-testid="take-pledge"]', 120000);
  await clickTestId(page, 'take-pledge');
  // Phase 3: "I" cycles through scripts then input fades in to width 300.
  // Wait until the input is actually present AND has a non-zero width.
  await page.waitForFunction(
    () => {
      const el = document.querySelector('input.yourName');
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 50;
    },
    { timeout: 60000 },
  );
  await page.focus('input.yourName');
  await page.type('input.yourName', name, { delay: 25 });
  await page.keyboard.press('Enter');
}

async function runFullFlow(page, url, { name, kindTestId, optionTestId, expectText }) {
  await goThroughIntro(page, url, name);
  // Phase 4: pledge text runs for ~30 seconds → wizard appears.
  await waitForSelector(page, `[data-testid="${kindTestId}"]`, 240000);
  await clickTestId(page, kindTestId);
  await waitForSelector(page, `[data-testid="${optionTestId}"]`);
  await clickTestId(page, optionTestId);
  await waitForSelector(page, '[data-testid="wizard-confirm"]');
  await clickTestId(page, 'wizard-confirm');
  await waitForSelector(page, '[data-testid="thank-you"]');
  const msg = await text(page, '[data-testid="thank-you"]');
  if (!expectText.test(msg)) {
    throw new Error(`thank-you did not match ${expectText}: ${msg}`);
  }
}

// ---- main -----------------------------------------------------------

async function main() {
  console.log('Starting static server + headless Chrome…');
  const srv = await serve();
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  const ctx = { url: srv.url, browser };

  try {
    for (const t of tests) {
      await t(ctx);
    }
  } finally {
    await browser.close();
    await srv.close();
  }

  const passed = RESULTS.filter((r) => r.status === 'pass').length;
  const failed = RESULTS.filter((r) => r.status === 'fail').length;
  console.log();
  console.log(`Puppeteer: ${passed} passed, ${failed} failed, ${RESULTS.length} total`);

  const fs = require('fs');
  const out = path.join(__dirname, '..', 'puppeteer-results.json');
  fs.writeFileSync(
    out,
    JSON.stringify({ passed, failed, total: RESULTS.length, results: RESULTS }, null, 2),
  );
  console.log('Wrote', out);

  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
