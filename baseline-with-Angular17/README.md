# baseline-with-Angular17

Successful production build of **Kree**, ported to **Angular 17.3**.

## Contents

- `build.log` — captured stdout of `ng build --configuration production`.
- `dist/` — a snapshot of the build output (same as `/dist/` at the repo
  root, copied here for archival).

## How to reproduce

```sh
npm install
npm run build
# artefacts land in dist/client
```

## Build summary (from this snapshot)

```
Initial chunk files           | Names         |  Raw size | Estimated transfer size
main.*.js                     | main          | 226.26 kB |                60.22 kB
polyfills.*.js                | polyfills     |  33.98 kB |                11.06 kB
styles.*.css                  | styles        |   1.94 kB |               729 bytes
runtime.*.js                  | runtime       | 886 bytes |               510 bytes
                              | Initial total | 263.04 kB |                72.49 kB
```

Hash: `261137c2de1678c4`. Angular 17.3, standalone bootstrap, zone.js
polyfills.

## What changed vs. the original Angular 2 codebase

The notes here only cover the migration itself. Feature work (breathe
animation, dark mode, donation wizard, responsive pass) is described in
the top-level `PREAMBLE.md` and in the matching component files.

### Toolchain

| Area           | Before                      | After                                         |
|----------------|-----------------------------|-----------------------------------------------|
| Angular        | 2.4.7                       | 17.3                                          |
| Angular CLI    | 1.0.0-beta.31               | 17.3                                          |
| TypeScript     | 2.1                         | 5.4                                           |
| Builder        | `@angular/cli` legacy       | `@angular-devkit/build-angular:browser`       |
| Bootstrap      | `platformBrowserDynamic`    | `bootstrapApplication()` + standalone         |
| Modules        | `KreeModule` (NgModule)     | Standalone components                         |
| Zone polyfill  | `zone.js/dist/zone`         | `zone.js` (17's polyfill entry)               |
| core-js es6/es7| yes                         | removed (target ES2022)                       |
| Http           | `@angular/http` (removed)   | dropped entirely — unused                     |

### Config files

- `package.json` rewritten with Angular 17 deps and scripts.
- `angular.json` written from scratch (the legacy `angular-cli.json`
  schema from v1 beta is not compatible with the v17 CLI).
- `tsconfig.json` + `tsconfig.app.json` for TS 5.4 / ES2022.
- `src/polyfills.ts`, `src/test.ts`, `src/tsconfig.json`, `src/typings.d.ts`
  deleted — their concerns live in `angular.json` / root `tsconfig` now.
- Old Angular 2 config artefacts removed at the root:
  `angular-cli.json`, `karma.conf.js`, `protractor.conf.js`, `tslint.json`,
  stray `npm-debug.log.*` files.
- `src/app/kree/kree.module.ts` and `kree.router.ts` deleted — in the
  standalone world, `KreeComponent` bootstraps directly.
- `src/app/kree/test/` (the dead `my-test` component) deleted.

### Component ports

Each component was ported from the original `ngOnInit + setTimeout`
style to standalone Angular 17, with these minimum edits:

- Added `standalone: true` and explicit `imports:` (`CommonModule`,
  `FormsModule`, child components as needed).
- Changed `private` fields that are referenced from templates to
  `public` (the Angular 17 strict template pipeline rejects
  private-field reads).
- Stored every `setTimeout` handle on a `timers: any[]` field and
  added `ngOnDestroy` that clears them — the originals leaked on
  component teardown.
- `ThisMomentComponent.next()` no longer mutates `.style.marginTop`
  on `HTMLCollection` items; it flips a host `fadingOut` boolean and
  lets the CSS do the fade.
- `KreeComponent.alert()` (broken, unused) removed. `@ViewChild('hand')`
  (no matching template element) removed.
- `TestComponent` (declared but never rendered in the original) removed.
- `HttpModule` import removed from what used to be `KreeModule`.
- `QuestionComponent.onClick()` now guards against double-emit (the
  auto-advance timer and the user click could both fire).

### New work introduced alongside the upgrade

- `services/theme.service.ts` + `data-theme` attribute on `<html>` →
  dark is default, light is opt-in.
- `this-moment` now hosts a `.breath-orb` element with
  `breathe-in` / `breathe-out` keyframe animations, visible through
  Phases 1 and 2 of the intro.
- `donation-wizard/` — new 3-step wizard (time vs resources → option
  picker → confirm) rendered after `PledgeComponent` emits
  `pledgeDone`.
- The "Take a pledge" button was re-implemented as a real `<button>`
  instead of a `<div (click)>` with `(hover)`.
- Root template now has a header with a `theme-toggle` button and a
  `kree-stage` wrapper that drives the responsive grid.

### Known non-issues

- The build emits two warnings about `src/environments/*.ts` being
  "part of the TypeScript compilation but unused". This is because
  the `src/environments/` folder from the original starter is still
  on disk but no code imports it. The warnings are harmless and are
  not treated as errors.
