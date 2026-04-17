# responsive-design

Screenshots of every key screen in Kree at three viewport widths.

## Form factors

| Folder    | Viewport (CSS px)  | Reference device          |
|-----------|---------------------|---------------------------|
| [`mobile/`](mobile/)   | **390 × 844**       | iPhone 13 mini            |
| [`tablet/`](tablet/)   | **820 × 1180**      | iPad Air                  |
| [`laptop/`](laptop/)   | **1366 × 800**      | typical Windows laptop    |

The screenshots were captured with Puppeteer (headless Chromium 127)
using `page.setViewport({ width, height })` — the same code path
that real Chrome uses for device emulation.

## Frames captured per form factor

Each form-factor folder contains the same 5 frames:

| #   | Frame                              | What it shows                                                |
|-----|------------------------------------|--------------------------------------------------------------|
| 01  | `01-intro-dark.png`                | Pause / breathe orb, dark theme                              |
| 02  | `02-intro-light.png`               | Same screen after toggling to light theme                    |
| 03  | `03-take-pledge.png`               | The "Take a pledge" button — checks header + button layout   |
| 04  | `04-wizard-kind.png`               | Donation wizard step 1 — "Donate time" / "Donate resources"  |
| 05  | `05-wizard-options.png`            | Donation wizard step 2 — list of time activities             |

## Things to look for in each form factor

### mobile (390 × 844)

- Wizard step 1 is **single column** (the `kind-grid` collapses at
  `max-width: 640px`).
- Header brand text shrinks (`.brand { font-size: 1rem }` at
  `max-width: 640px`).
- Breath-orb is reduced from 180 → 130 px (`max-width: 767px` rule
  in `this-moment.component.css`).
- Pledge font is 22 px instead of 30 px.

### tablet (820 × 1180)

- Wizard step 1 is **two columns** (`@media (min-width: 768px)` for
  the bootstrap-style `col-sm-*` shim kicks in; the `kind-grid` at
  `> 640 px` is also two columns).
- The breath orb is at full size.
- The "Take a pledge" button is centred in the same column the
  pledge text uses.

### laptop (1366 × 800)

- Full Bootstrap-style 8-column centred layout
  (`col-md-offset-3 col-md-6` in `kree.component.html`).
- Wizard cards are at their largest size; `option-card` shows the
  full blurb on a single line.
- Header has plenty of padding; theme toggle sits comfortably to
  the right of "Kree."

## How to regenerate

```sh
npm run build
node tests-baseline/storyboards.cjs responsive
```

This capture takes a few minutes per viewport because each form
factor walks through the slow intro flow, types a name, and waits
for the pledge to play out.

## Related files

- `src/styles.css` — defines the grid shim and all CSS variables
  used by light/dark themes.
- `src/app/kree/kree.component.css` — header layout + responsive
  shrink at `max-width: 640px`.
- `src/app/kree/this-moment/this-moment.component.css` — breath orb
  size at mobile.
- `src/app/kree/pledge/pledge.component.scss` — pledge font shrink
  at mobile.
- `src/app/kree/donation-wizard/donation-wizard.component.scss` —
  wizard-grid collapse and title shrink at `max-width: 640px`.
