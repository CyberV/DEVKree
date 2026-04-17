# Kree — Walkthrough

This is a guided tour of the **Angular 17 Kree** application as it
exists on this branch. It links to visual storyboards captured by the
Puppeteer screenshot runner under
[`tests-baseline/storyboards.cjs`](tests-baseline/storyboards.cjs).

If you have not yet read [`PREAMBLE.md`](PREAMBLE.md), do that first
— it explains *why* this app is the shape it is.

## How to follow along

```sh
npm install
npm run build         # produces dist/client
node tests-baseline/storyboards.cjs   # writes runtime-old, runtime-new, responsive-design
```

You can also just open
[`dist/client/index.html`](baseline-with-Angular17/dist/client/index.html)
under a static server (`npx http-server dist/client`) and follow the
flow yourself. Plan for ~90 seconds end-to-end — the pacing is
deliberate.

## The five user flows

There are **two top-level flows** through the app and **three
"toggles"** that cut across both.

### Flow A — the original pledge ritual

The user is led through the same ritual that existed in the Angular 2
codebase, with the same copy and roughly the same pacing. The
breathe orb (new) sits behind the "Pause." / "Take a breath." text;
otherwise everything in this flow looks like the original.

Storyboard: [`runtime-old/`](runtime-old/) — 15 screenshots, in
order:

| #   | Phase                  | Screenshot                                                   |
|-----|------------------------|--------------------------------------------------------------|
| 01  | Intro — Pause          | [`01-pause.png`](runtime-old/01-pause.png)                   |
| 02  | Intro — Take a breath  | [`02-take-a-breath.png`](runtime-old/02-take-a-breath.png)   |
| 03  | Q1 — Where are you     | [`03-question-where.png`](runtime-old/03-question-where.png) |
| 04  | Q2 — What time is it?  | [`04-question-when.png`](runtime-old/04-question-when.png)   |
| 05  | Q3 — What are you?     | [`05-question-what.png`](runtime-old/05-question-what.png)   |
| 06  | Take a pledge button   | [`06-take-pledge-button.png`](runtime-old/06-take-pledge-button.png) |
| 07  | "I" — Latin            | [`07-your-name-i-latin.png`](runtime-old/07-your-name-i-latin.png) |
| 08  | "I" — Devanagari       | [`08-your-name-i-devanagari.png`](runtime-old/08-your-name-i-devanagari.png) |
| 09  | Name input appears     | [`09-your-name-input.png`](runtime-old/09-your-name-input.png) |
| 10  | Name typed             | [`10-your-name-typed.png`](runtime-old/10-your-name-typed.png) |
| 11  | "I … am here now."     | [`11-name-accepted.png`](runtime-old/11-name-accepted.png)   |
| 12  | "At this moment, I pledge" | [`12-pledge-at-this-moment.png`](runtime-old/12-pledge-at-this-moment.png) |
| 13  | TO DO good / great     | [`13-pledge-to-do-good.png`](runtime-old/13-pledge-to-do-good.png) |
| 14  | BECAUSE I can.         | [`14-pledge-because-i-can.png`](runtime-old/14-pledge-because-i-can.png) |
| 15  | Full pledge on screen  | [`15-pledge-full.png`](runtime-old/15-pledge-full.png)       |

The original Kree ends here — the user reads their pledge and
eventually navigates away.

### Flow B — the donation wizard (new)

After Flow A reaches its final line ("I need to."), the
`PledgeComponent` waits 3 seconds and then opens the **donation
wizard**. The user picks how they want to act on the pledge:

- **Donate time.** Mentor a student, join a clean-up, visit a
  hospital or elder home, teach a skill.
- **Donate resources.** Money, materials, infrastructure, sponsor a
  meal.

The wizard is a 3-step branch: kind → option → confirm. The user can
back up at any step. Confirming lands them on a "Thank you" screen
with a "Start again" button that resets the entire flow.

Storyboard: [`runtime-new/`](runtime-new/) frames 06–13.

| #   | Step                                               | Screenshot                                                                  |
|-----|----------------------------------------------------|-----------------------------------------------------------------------------|
| 06  | Wizard step 1 — pick kind                          | [`06-wizard-step1.png`](runtime-new/06-wizard-step1.png)                    |
| 07  | Wizard step 2 — time options                       | [`07-wizard-step2-time.png`](runtime-new/07-wizard-step2-time.png)          |
| 08  | Wizard step 3 — confirm "Mentor a student"         | [`08-wizard-step3-confirm-time.png`](runtime-new/08-wizard-step3-confirm-time.png) |
| 09  | Thank you (time branch)                            | [`09-thank-you-time.png`](runtime-new/09-thank-you-time.png)                |
| 10  | Wizard step 1 (light theme)                        | [`10-wizard-step1-light.png`](runtime-new/10-wizard-step1-light.png)        |
| 11  | Wizard step 2 — resource options (light)           | [`11-wizard-step2-resources-light.png`](runtime-new/11-wizard-step2-resources-light.png) |
| 12  | Wizard step 3 — confirm "Donate money" (light)     | [`12-wizard-step3-confirm-resources-light.png`](runtime-new/12-wizard-step3-confirm-resources-light.png) |
| 13  | Thank you (resources, light)                       | [`13-thank-you-resources-light.png`](runtime-new/13-thank-you-resources-light.png) |

### Toggle 1 — Breathe-in / breathe-out animation

A pulsing orb sits behind the "Pause." and "Take a breath." text on
the intro screen. While the heading says "Pause." the orb is
expanding (`breathe-in`); when "Take a breath." appears, the orb
contracts (`breathe-out`). When the questions block is reached, the
orb fades away.

Implementation: `src/app/kree/this-moment/this-moment.component.ts`
exposes a `breathe: 'in' | 'out' | 'idle'` flag set on the same
`setTimeout` chain that drives the headings. The visual is in
`this-moment.component.css` via two keyframe animations
(`kreeBreatheIn`, `kreeBreatheOut`).

Storyboard: [`runtime-new/01-breathe-in-dark.png`](runtime-new/01-breathe-in-dark.png) and
[`runtime-new/02-breathe-out-dark.png`](runtime-new/02-breathe-out-dark.png).

### Toggle 2 — Dark / light mode

A small theme toggle button lives in the header (`🌙 dark` /
`☀️ light`). Default is **dark** (the original Kree was dark);
clicking the button writes `kree.theme=light` to localStorage and
sets `data-theme="light"` on `<html>`. All component colours come
from CSS variables defined in `src/styles.css`.

Storyboard:
[`runtime-new/03-header-dark.png`](runtime-new/03-header-dark.png) →
[`runtime-new/04-header-light.png`](runtime-new/04-header-light.png) →
[`runtime-new/05-breathe-light.png`](runtime-new/05-breathe-light.png).

The theme service also honours `prefers-color-scheme` on first boot
when no preference is stored.

### Toggle 3 — Responsive design

Every screen is checked at three viewports:

| Form factor | Viewport (CSS px) |
|-------------|--------------------|
| mobile      | 390 × 844 (iPhone 13 mini)         |
| tablet      | 820 × 1180 (iPad Air)              |
| laptop      | 1366 × 800 (typical Windows laptop)|

The breakpoints are:

- `< 640 px` — wizard kind picker collapses to a single column;
  thank-you headline shrinks; header padding tightens.
- `< 768 px` — `this-moment` breath orb is smaller; pledge font
  drops from 30 → 22 px; "I"-cycle layout is hand-checked.
- `≥ 768 px` — bootstrap-style 8-column centred layout via the
  shim grid in `src/styles.css`.

Storyboard: [`responsive-design/`](responsive-design/) contains one
folder per form factor, each with five frames (intro dark, intro
light, take-pledge, wizard kind, wizard options).

## Reset

After any "thank-you" screen, the **Start again** button calls
`KreeComponent.resetFlow()` which clears `beginPledge`, `doPledge`,
`showWizard`, and `donationDone`. The component re-mounts from the
top so the entire ritual replays from "Pause."
