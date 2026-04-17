# tests-baseline

The baseline test suite for the Angular 17 Kree app, plus the
results of running it on the clean build produced in
`../baseline-with-Angular17/`.

## Layout

```
tests-baseline/
├── run.js                     # orchestrator — unit + coverage + e2e
├── unit-runner.cjs            # minimal test runner used by the unit tests
├── coverage-report.cjs        # post-processor for c8 JSON (see below)
├── server.js                  # tiny static file server used by e2e
├── stubs/                     # fake @angular/* modules for unit tests
│   ├── angular-core.cjs
│   ├── angular-common.cjs
│   └── angular-forms.cjs
├── unit/                      # unit tests (component classes, direct)
│   ├── helpers.ts
│   ├── theme.service.test.ts
│   ├── this-moment.component.test.ts
│   ├── question.component.test.ts
│   ├── your-name.component.test.ts
│   ├── typeaway.component.test.ts
│   ├── drop-bomb.component.test.ts
│   ├── pledge.component.test.ts
│   ├── donation-wizard.component.test.ts
│   └── kree.component.test.ts
├── e2e/                       # Puppeteer end-to-end smoke tests
│   └── puppeteer-smoke.cjs
├── coverage/                  # c8 output + filtered summary (generated)
│   ├── coverage-final.json
│   └── kree-branch-summary.json
├── puppeteer-results.json     # last Puppeteer run's results (generated)
├── unit-results.txt           # last unit-test run's output (generated)
└── e2e-results.txt            # last e2e run's output (generated)
```

## Running

From the repo root:

```sh
# unit + coverage + puppeteer (rebuilds dist/client if missing)
node tests-baseline/run.js

# unit tests only
node tests-baseline/run.js --unit-only

# e2e only (assumes dist/client is already built)
node tests-baseline/run.js --e2e-only
```

## How the unit tests work

Angular 17 components normally need `TestBed`, Karma, and Jasmine —
we don't want that much machinery for a test suite whose whole job
is to measure branch coverage of a handful of small component
classes. Instead, we:

1. Install a **CommonJS resolve hook** (`unit-runner.cjs`) that
   redirects every `@angular/*` import to a local stub
   (`tests-baseline/stubs/*.cjs`). The stubs export no-op decorators
   (`Component`, `Input`, `Output`, `Injectable`, …) and a tiny
   `signal()` / `inject()` / `EventEmitter` / `ElementRef`
   implementation — just enough for the component classes to load
   and run.
2. Register **tsx/cjs** as the TypeScript transpiler so `.ts` source
   files can be `require()`'d directly.
3. Import each test file from `tests-baseline/unit/*.test.ts`. The
   tests instantiate component classes directly and exercise their
   methods, using a tiny fake-timer helper (`installFakeTimers` in
   `unit/helpers.ts`) so the `setTimeout` chains advance
   deterministically without wall-clock sleeping.

Because the classes run in plain Node with no Angular runtime, the
coverage tool sees only the developer-written TypeScript — **no
change-detection, no zone, no DI container, no template compilation**.

## How the branch-coverage number is computed

We run the unit tests under **c8** to collect V8-native coverage on
the TypeScript source. c8 is accurate for statements, functions,
and lines, but its **branch counts are inflated** when the source
uses legacy `@Component({...})` decorators: tsx's transpile pass
injects `tslib` helpers (`__decorate`, `__classPrivateFieldGet`) at
the top of every file, and the class-decorator-application pattern
(`ClassName = __decorate([...], ClassName)`) produces short-circuit
operators that V8 reports as "branches". Those branches are
impossible to execute from a unit test and are not anywhere in the
developer's source — they are pure transpile artefacts.

`coverage-report.cjs` reads c8's `coverage-final.json` and drops:

- any branch whose first location is **line 1, column 0** (the
  tslib helpers at the top of every file), and
- any branch whose first location starts at **column 13** on a
  class-decorator line (the `ClassName = __decorate(...)` rewrite
  that V8 counts once per decorator).

Both of those are deterministic markers — the line/column positions
come from tsx's output and do not drift between runs. The filtered
number is written to
`tests-baseline/coverage/kree-branch-summary.json`.

The filter is **permissive** in one direction (it can never
undercount real developer branches) and **strict** in the other
(it drops only branches that match both the line and the column
marker, not any branch on those lines). Every remaining branch is
code we wrote ourselves — `if`, `else`, `?:`, `&&`, `||`, `??`,
optional chaining, `switch` cases, etc.

## Last-run results

Stored alongside this README:

- `unit-results.txt` — stdout of the unit test phase.
- `coverage/coverage-final.json` — raw c8 coverage.
- `coverage/kree-branch-summary.json` — filtered developer-branch
  summary, the canonical "90% target" number.
- `puppeteer-results.json` — JSON with pass/fail/timing per e2e
  test.
- `e2e-results.txt` — stdout of the Puppeteer phase.

See `last-run.md` for a human-readable summary of the most recent
execution on this baseline.
