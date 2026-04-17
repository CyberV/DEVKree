// Storyboard screenshot runner for Kree.
//
// Serves the Angular 17 build, drives it with Puppeteer, and
// captures screenshots into three folders:
//
//   runtime-old/         the original-equivalent flow (intro →
//                        questions → take-pledge → name → pledge)
//   runtime-new/         new features (breathe animation close-up,
//                        dark/light toggle, donation wizard both
//                        branches, thank-you)
//   responsive-design/   the same set of key frames captured at
//                        mobile / tablet / laptop viewports
//
// Usage:
//   node tests-baseline/storyboards.cjs               # all three
//   node tests-baseline/storyboards.cjs runtime-old
//   node tests-baseline/storyboards.cjs runtime-new
//   node tests-baseline/storyboards.cjs responsive

'use strict';

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { serve } = require('./server');

const ROOT = path.resolve(__dirname, '..');
const wanted = process.argv.slice(2);
const runAll = wanted.length === 0;

const FOLDERS = {
  'runtime-old':       path.join(ROOT, 'runtime-old'),
  'runtime-new':       path.join(ROOT, 'runtime-new'),
  'responsive-design': path.join(ROOT, 'responsive-design'),
};

function ensureFolder(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function wantFolder(key) {
  return runAll || wanted.includes(key) || (key === 'responsive-design' && wanted.includes('responsive'));
}

// ---- helpers --------------------------------------------------------

async function newPage(browser, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  return page;
}

async function clickTestId(page, id) {
  await page.click(`[data-testid="${id}"]`);
}

async function waitTestId(page, id, timeout = 240000) {
  await page.waitForSelector(`[data-testid="${id}"]`, { timeout });
}

async function waitSelector(page, sel, timeout = 240000) {
  await page.waitForSelector(sel, { timeout });
}

async function settle(page, ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function snapshot(page, dir, name) {
  ensureFolder(dir);
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('  📸', path.relative(ROOT, file));
}

async function goIntro(page, url, theme = 'dark') {
  // We can only write to localStorage once the page is on an origin.
  // First navigation, set theme, then reload so the new theme is
  // picked up on boot.
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate((m) => {
    try { localStorage.setItem('kree.theme', m); } catch { /* noop */ }
  }, theme);
  await page.reload({ waitUntil: 'networkidle0' });
}

// Back-compat shim — the older call sites pass a theme and then
// navigate. Kept as a no-op so we don't have to edit every call site.
async function setTheme(_page, _mode) { /* handled by goIntro */ }

async function goThroughIntroUpToPledge(page, url) {
  await goIntro(page, url);
  await waitTestId(page, 'take-pledge');
}

async function typeName(page, name) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector('input.yourName');
      return el && el.getBoundingClientRect().width > 50;
    },
    { timeout: 120000 },
  );
  await page.focus('input.yourName');
  await page.type('input.yourName', name, { delay: 15 });
  await page.keyboard.press('Enter');
}

// ---- runtime-old ----------------------------------------------------

async function captureRuntimeOld(browser, url) {
  const dir = FOLDERS['runtime-old'];
  ensureFolder(dir);
  console.log('\n>>> runtime-old  (original-equivalent flow)');

  const page = await newPage(browser, { width: 1280, height: 800 });
  await goIntro(page, url, 'dark');

  // Phase 1: pause / breathe
  await settle(page, 2000);
  await snapshot(page, dir, '01-pause');

  await settle(page, 2500);
  await snapshot(page, dir, '02-take-a-breath');

  // Phase 2: questions
  await waitSelector(page, '.questions question');
  await settle(page, 4000);
  await snapshot(page, dir, '03-question-where');

  await page.waitForFunction(
    () => document.querySelectorAll('.questions question').length >= 2,
    { timeout: 30000 },
  );
  await settle(page, 3000);
  await snapshot(page, dir, '04-question-when');

  await page.waitForFunction(
    () => document.querySelectorAll('.questions question').length >= 3,
    { timeout: 30000 },
  );
  await settle(page, 3000);
  await snapshot(page, dir, '05-question-what');

  // Phase 3: take a pledge button
  await waitTestId(page, 'take-pledge');
  await settle(page, 500);
  await snapshot(page, dir, '06-take-pledge-button');

  // Phase 4: your-name cycle → input → name typed
  await clickTestId(page, 'take-pledge');
  await page.waitForSelector('your-name .mai span');
  await settle(page, 500);
  await snapshot(page, dir, '07-your-name-i-latin');

  await settle(page, 2200);
  await snapshot(page, dir, '08-your-name-i-devanagari');

  // Wait for input to reach full width, then type
  await page.waitForFunction(
    () => {
      const el = document.querySelector('input.yourName');
      return el && el.getBoundingClientRect().width > 50;
    },
    { timeout: 120000 },
  );
  await snapshot(page, dir, '09-your-name-input');

  await page.focus('input.yourName');
  await page.type('input.yourName', 'Ada Lovelace', { delay: 15 });
  await snapshot(page, dir, '10-your-name-typed');

  await page.keyboard.press('Enter');
  await settle(page, 700);
  await snapshot(page, dir, '11-name-accepted');

  // Phase 5: pledge — take snapshots at intermediate states
  await page.waitForFunction(
    () => !!document.querySelector('pledge typeaway'),
    { timeout: 30000 },
  );
  await settle(page, 7000);
  await snapshot(page, dir, '12-pledge-at-this-moment');

  await settle(page, 6000);
  await snapshot(page, dir, '13-pledge-to-do-good');

  await settle(page, 8000);
  await snapshot(page, dir, '14-pledge-because-i-can');

  await settle(page, 10000);
  await snapshot(page, dir, '15-pledge-full');

  await page.close();
}

// ---- runtime-new ----------------------------------------------------

async function captureRuntimeNew(browser, url) {
  const dir = FOLDERS['runtime-new'];
  ensureFolder(dir);
  console.log('\n>>> runtime-new  (new features)');

  // A. breathe animation close-up (dark)
  {
    const page = await newPage(browser, { width: 1280, height: 800 });
    await goIntro(page, url, 'dark');
    await settle(page, 3500);
    await snapshot(page, dir, '01-breathe-in-dark');
    await settle(page, 2000);
    await snapshot(page, dir, '02-breathe-out-dark');
    await page.close();
  }

  // B. theme toggle: dark vs light header
  {
    const page = await newPage(browser, { width: 1280, height: 800 });
    await goIntro(page, url, 'dark');
    await settle(page, 1200);
    await snapshot(page, dir, '03-header-dark');
    await clickTestId(page, 'theme-toggle');
    await settle(page, 900);
    await snapshot(page, dir, '04-header-light');
    // Also capture the breathe orb on light background
    await settle(page, 2500);
    await snapshot(page, dir, '05-breathe-light');
    await page.close();
  }

  // C. wizard — time branch
  {
    const page = await newPage(browser, { width: 1280, height: 800 });
    await goIntro(page, url, 'dark');
    await waitTestId(page, 'take-pledge');
    await clickTestId(page, 'take-pledge');
    await typeName(page, 'Ada Lovelace');
    await waitTestId(page, 'donate-time');
    await settle(page, 400);
    await snapshot(page, dir, '06-wizard-step1');
    await clickTestId(page, 'donate-time');
    await waitTestId(page, 'opt-mentor');
    await settle(page, 400);
    await snapshot(page, dir, '07-wizard-step2-time');
    await clickTestId(page, 'opt-mentor');
    await waitTestId(page, 'wizard-confirm');
    await settle(page, 300);
    await snapshot(page, dir, '08-wizard-step3-confirm-time');
    await clickTestId(page, 'wizard-confirm');
    await waitTestId(page, 'thank-you');
    await settle(page, 500);
    await snapshot(page, dir, '09-thank-you-time');
    await page.close();
  }

  // D. wizard — resources branch + light theme
  {
    const page = await newPage(browser, { width: 1280, height: 800 });
    await goIntro(page, url, 'light');
    await waitTestId(page, 'take-pledge');
    await clickTestId(page, 'take-pledge');
    await typeName(page, 'Grace Hopper');
    await waitTestId(page, 'donate-resources');
    await settle(page, 400);
    await snapshot(page, dir, '10-wizard-step1-light');
    await clickTestId(page, 'donate-resources');
    await waitTestId(page, 'opt-money');
    await settle(page, 400);
    await snapshot(page, dir, '11-wizard-step2-resources-light');
    await clickTestId(page, 'opt-money');
    await waitTestId(page, 'wizard-confirm');
    await settle(page, 300);
    await snapshot(page, dir, '12-wizard-step3-confirm-resources-light');
    await clickTestId(page, 'wizard-confirm');
    await waitTestId(page, 'thank-you');
    await settle(page, 500);
    await snapshot(page, dir, '13-thank-you-resources-light');
    await page.close();
  }
}

// ---- responsive-design ----------------------------------------------

const RESPONSIVE_VIEWPORTS = [
  { key: 'mobile',  width: 390,  height: 844 },
  { key: 'tablet',  width: 820,  height: 1180 },
  { key: 'laptop',  width: 1366, height: 800 },
];

async function captureResponsive(browser, url) {
  const base = FOLDERS['responsive-design'];
  ensureFolder(base);
  console.log('\n>>> responsive-design  (mobile / tablet / laptop)');

  for (const vp of RESPONSIVE_VIEWPORTS) {
    const dir = path.join(base, vp.key);
    ensureFolder(dir);

    // Snapshot 1 — intro / breathe (dark)
    {
      const page = await newPage(browser, { width: vp.width, height: vp.height });
      await goIntro(page, url, 'dark');
      await settle(page, 3000);
      await snapshot(page, dir, '01-intro-dark');
      await clickTestId(page, 'theme-toggle');
      await settle(page, 900);
      await snapshot(page, dir, '02-intro-light');
      await page.close();
    }

    // Snapshot 2 — take pledge button
    {
      const page = await newPage(browser, { width: vp.width, height: vp.height });
      await goIntro(page, url, 'dark');
      await waitTestId(page, 'take-pledge');
      await settle(page, 400);
      await snapshot(page, dir, '03-take-pledge');
      await page.close();
    }

    // Snapshot 3 — wizard step 1 (kind picker)
    {
      const page = await newPage(browser, { width: vp.width, height: vp.height });
      await goIntro(page, url, 'dark');
      await waitTestId(page, 'take-pledge');
      await clickTestId(page, 'take-pledge');
      await typeName(page, 'Ada Lovelace');
      await waitTestId(page, 'donate-time');
      await settle(page, 500);
      await snapshot(page, dir, '04-wizard-kind');
      await clickTestId(page, 'donate-time');
      await waitTestId(page, 'opt-mentor');
      await settle(page, 400);
      await snapshot(page, dir, '05-wizard-options');
      await page.close();
    }
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

  try {
    if (wantFolder('runtime-old'))       await captureRuntimeOld(browser, srv.url);
    if (wantFolder('runtime-new'))       await captureRuntimeNew(browser, srv.url);
    if (wantFolder('responsive-design')) await captureResponsive(browser, srv.url);
  } finally {
    await browser.close();
    await srv.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
