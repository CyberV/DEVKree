# DEVKree — Kree (Angular 17)

> *"Pause. Take a breath. … At this moment, I pledge."*

Kree is a small contemplative single-page app: it walks the user
through a 90-second ritual that ends in a self-spoken pledge to do
good. This branch is a top-to-bottom upgrade of the original
Angular 2 starter to **Angular 17**, with a few new features bolted
on without disturbing the original pacing.

## Quick start

```sh
npm install
npm start                  # ng serve at http://127.0.0.1:4200
npm run build              # production build → dist/client
node tests-baseline/run.js # unit + branch coverage + puppeteer
```

## What's in this repo

| Path                              | What it is                                                               |
|-----------------------------------|--------------------------------------------------------------------------|
| [`PREAMBLE.md`](PREAMBLE.md)      | What the app is *for* — read this first                                  |
| [`WALKTHROUGH.md`](WALKTHROUGH.md)| End-to-end tour with links into every storyboard                         |
| [`docs-old/`](docs-old/)          | Documentation of the original Angular 2 codebase, pre-upgrade            |
| [`baseline-with-Angular17/`](baseline-with-Angular17/) | Successful Angular 17 production build + log + snapshot of `dist/` |
| [`tests-baseline/`](tests-baseline/) | Unit tests, Puppeteer e2e tests, coverage runner, last-run results    |
| [`runtime-old/`](runtime-old/)    | Storyboard of the original-equivalent flow (intro → pledge)              |
| [`runtime-new/`](runtime-new/)    | Storyboard of the new features (breathe, dark mode, donation wizard)    |
| [`responsive-design/`](responsive-design/) | Screenshots at mobile / tablet / laptop viewports               |
| `src/app/kree/`                   | The Angular 17 component source                                          |

## Test results (latest run)

- **Unit tests:** 54 passed / 0 failed
- **Branch coverage** (developer-branches under `src/app/kree/`):
  **100% (112 / 112)** — see
  [`tests-baseline/last-run.md`](tests-baseline/last-run.md)
- **Puppeteer end-to-end:** 7 passed / 0 failed
- **Production build:** clean — see
  [`baseline-with-Angular17/build.log`](baseline-with-Angular17/build.log)

## New features in this branch

1. **Breathe-in / breathe-out animation** behind the intro pause text.
2. **Dark / light theme toggle** in the header (dark is still the
   default — the original was dark).
3. **Donation wizard** after the pledge: time vs resources, then a
   concrete option, then a thank-you.
4. **Responsive layout** verified on three viewports.

See [`WALKTHROUGH.md`](WALKTHROUGH.md) for the visual tour.
