# docs-old — Documentation of the original Angular 2 codebase

This folder documents **Kree** as it existed before the Angular 17
upgrade. It is a point-in-time snapshot: what the code was, how it was
wired, how a user experienced it, and where the rough edges lived.

Nothing in this folder is meant to be executed — it is reference
material so that future contributors can understand *why* the upgraded
code looks the way it does.

## Contents

- [`architecture.md`](architecture.md) — high-level layout, module
  graph, and how the app boots.
- [`components.md`](components.md) — every component under
  `src/app/kree`, what it does, what it emits/consumes, and what timers
  it runs.
- [`user-flow.md`](user-flow.md) — the step-by-step experience from
  the user's perspective, with timings.
- [`build-and-run.md`](build-and-run.md) — how the original toolchain
  was intended to be used (`ng serve`, `ng build --prod`, Express
  serving `dist/client`).
- [`known-issues.md`](known-issues.md) — bugs and oddities preserved
  as-is in the original code.
