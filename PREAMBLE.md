# Kree — Preamble & Intent

## What the application is

**Kree** (tagline: *"Act Now."*) is a small, contemplative single-page web
application originally scaffolded on top of an `angular2-express-starter`
(Angular 2.4 + Express). It is not a traditional SaaS product — it behaves
more like an interactive poem or guided-meditation ritual. The user is led,
step by step, through a short sequence whose emotional arc is:

1. **Stop.** Pause whatever you were doing.
2. **Breathe.** Take a breath and become present.
3. **Locate yourself.** A short catechism — *Where are you? / What time is
   it? / What are you?* — with the answers pre-written (*Here / Now / This
   moment*) so that the user is not being quizzed, they are being reminded.
4. **Announce yourself.** The word "I" cycles through several scripts
   (Latin, Devanagari, Gurmukhi, Kannada, Urdu) before a name input appears
   and the user types their full name — becoming *"I \<name\> am here
   now."*
5. **Take a pledge.** A typewriter-style line spells out *"At this moment,
   I pledge TO DO good, great, BECAUSE I can. I want to. I need to."* —
   the pledge is pre-written; the act is in reading it consciously.

The sole route (`/`) is the `KreeComponent`, which composes the flow from
child components (`this-moment`, `question`, `your-name`, `pledge`,
`typeaway`, `drop-bomb`). There is no backend interaction, no persistence,
no account — the Express server exists only to serve the SPA.

## Intent, as best we can read it

The author is clearly more interested in *experience* than *functionality*.
Every component is structured around timed `setTimeout` chains that pace
the text — characters type out, question marks pulse, the answer fades
in, and the user is gently nudged forward. The intent appears to be:

- **Slow the user down.** Nothing on the page can be rushed. The pacing is
  the point.
- **Get the user to perform a small, sincere public (to themselves)
  gesture** — a pledge to "do good, great" — framed as a first-person
  act of will, not a promise to a platform.
- **Keep the surface area minimal.** Black background, white text, one
  candle GIF, one font family. The design is deliberately stark so that
  nothing competes with the words.
- **Be multilingual only at the most intimate moment** — the word "I" —
  acknowledging that the user has an identity in more than one script
  before asking them to type their Latin-alphabet name.

What is conspicuously *missing* is any "call to action after the pledge"
— the original flow ends at *"I need to."* and simply stops. In the new
work captured in this repo, a **donation wizard** is added to give that
pledge somewhere to land: the user who has just pledged to do good is
immediately offered a concrete way to do it (donate time, or donate
resources).

## Technical shape (as originally built)

- **Framework:** Angular 2.4.7 with `@angular/cli` 1.0.0-beta.31.
- **Server:** Express 4 with `ngrx/*` listed in deps but unused in `kree`.
- **Bootstrap entry:** `src/main.ts` → `KreeModule` (there is no root
  `AppModule`; `KreeModule` *is* the app module and bootstraps
  `KreeComponent` directly).
- **Routing:** `kree.router.ts` defines a single route `''` →
  `KreeComponent`, but it is **not imported** anywhere — the app is
  effectively route-less; the component is mounted via the `<app-kree>`
  tag in `index.html`.
- **Styling:** A mix of Bootstrap 3 grid classes, `animate.css` classes
  (`animated fadeIn fadeOut pulse`), and per-component SCSS. Global styles
  set `body { background: black; color: white; overflow: hidden; }`.
- **Known rough edges** (preserved for faithfulness):
  - `KreeComponent.alert()` touches `this.hand.nativeElement.css.top`,
    which is not a real DOM API — dead code.
  - `ThisMomentComponent.next()` mutates DOM via
    `document.getElementsByClassName(...).style.marginTop`, which does
    not exist on an `HTMLCollection` in strict TS.
  - `KreeModule` imports `HttpModule` but never makes an HTTP call.
  - Class members are declared `private` but referenced from templates —
    legal at runtime in AOT of that era, rejected by modern strict TS.
  - The `test/` component (`my-test` selector) is declared in the module
    but never rendered.

These are documented in `docs-old/` and corrected in the Angular 17
upgrade, not "cleaned up" silently.

## Why this preamble matters for subsequent work

The later tasks in this repo (Angular 17 upgrade, dark mode, donation
wizard, responsive pass) all risk smoothing away the things that make
this app distinctive. The rules we followed:

1. **Do not change the pacing.** The `setTimeout` chains *are* the UX.
2. **Do not "fix" the pledge wording.** It is load-bearing copy.
3. **Dark mode is the *default*, not an add-on.** The original is black.
   Light mode is what is being added.
4. **The donation wizard is opt-in at the end of the pledge**, not a
   replacement for it. The pledge must still stand alone.
