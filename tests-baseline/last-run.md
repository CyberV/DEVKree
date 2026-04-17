# Last baseline run

Run against the Angular 17 build at `baseline-with-Angular17/dist/`.

## Unit tests — 54 / 54 passing

```
ThemeService (10)
ThisMomentComponent (6)
QuestionComponent (4)
YourNameComponent (7)
TypeawayComponent (5)
DropBombComponent (2)
PledgeComponent (2)
DonationWizardComponent (11)
KreeComponent (7)
───────────────
Tests: 54 passed, 0 failed, 54 total
```

(Full stdout: [`unit-results.txt`](./unit-results.txt))

## Developer-branch coverage — 100%

```
File                                                  Branches    %
kree.component.ts                                       7/7     100.00
donation-wizard/donation-wizard.component.ts           14/14    100.00
drop-bomb/drop-bomb.component.ts                        8/8     100.00
pledge/pledge.component.ts                              3/3     100.00
question/question.component.ts                        20/20    100.00
services/theme.service.ts                              17/17    100.00
this-moment/this-moment.component.ts                   11/11    100.00
typeaway/typeaway.component.ts                         11/11    100.00
your-name/your-name.component.ts                       21/21    100.00
                                                      ──────
Branches   : 100.00% (112/112)
Statements : 100.00% (665/665)
Functions  : 100.00% (108/108)
Lines      : 100.00% (665/665)
```

- **Target: ≥ 90% branch coverage** of components under `kree/`
- **Actual: 100%** (112 / 112 developer branches)

Raw c8 output and the post-filter JSON live under
[`coverage/`](./coverage). Filtering methodology is documented in
[`README.md`](./README.md#how-the-branch-coverage-number-is-computed).

## Puppeteer e2e — 7 / 7 passing

```
✔ app mounts and renders the Kree header
✔ html gets data-theme="dark" by default
✔ theme toggle flips dark → light
✔ breathe-orb is visible on the intro
✔ full flow (time branch): Take a pledge → wizard → time → mentor → thank you
✔ full flow (resources branch): Donate money → thank you
✔ wizard back-button unwinds step 3 → step 2 → step 1

Puppeteer: 7 passed, 0 failed, 7 total
```

(Full stdout: [`e2e-results.txt`](./e2e-results.txt); structured:
[`puppeteer-results.json`](./puppeteer-results.json))

## Environment

- Node: 22.22
- Angular: 17.3
- Puppeteer: 22.6 with bundled Chromium 127
- Headless mode: `headless: 'new'`
- Viewport (smoke tests): 1200 × 800
