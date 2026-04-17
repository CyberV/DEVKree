# Architecture (original)

## Top-level shape

```
DEVKree/
├── src/                      # Angular client
│   ├── index.html            # mounts <app-kree> directly
│   ├── main.ts               # bootstraps KreeModule (no AppModule!)
│   ├── polyfills.ts          # core-js + zone.js
│   ├── styles.css            # fonts + global black/white theme
│   └── app/
│       ├── index.ts          # empty (1 byte)
│       └── kree/             # the entire app
│           ├── kree.module.ts
│           ├── kree.router.ts      # defined but never imported
│           ├── kree.component.{ts,html,css}
│           ├── this-moment/       # pause → breath → 3 questions
│           ├── question/          # typewriter + pulsing answer
│           ├── your-name/         # "I" in 5 scripts, then name input
│           ├── pledge/            # orchestrates the final pledge text
│           ├── typeaway/          # reusable typewriter span
│           ├── drop-bomb/         # whole-word drop-in (used for "TO DO")
│           └── test/              # dead component, declared but unused
├── server/                   # Express backend (serves dist/client)
├── e2e/                      # protractor scaffolding (unused)
└── package.json              # Angular 2.4.7, @angular/cli 1.0.0-beta.31
```

## Boot path

1. `package.json` `start` runs `ng serve --aot --proxy-config ...` and,
   concurrently, compiles the Express server with `tsc -p ./server` and
   runs `nodemon dist/server/bin/www.js`.
2. `src/main.ts` imports `polyfills.ts`, then calls
   `platformBrowserDynamic().bootstrapModule(KreeModule)`.
3. `KreeModule` lists `KreeComponent` in `bootstrap: [...]` — so
   `KreeComponent` is the root component. There is no intermediate
   `AppComponent` / `AppModule`.
4. `index.html` contains `<app-kree>yo</app-kree>`. Angular replaces
   that element with the rendered `KreeComponent` template.

## Module graph

```
KreeModule
├── BrowserModule      (required for the browser bootstrap)
├── FormsModule        (needed for ngModel on the name input)
└── HttpModule         (imported but never used anywhere in kree/)

declarations:
    KreeComponent          ← bootstrap
    ThisMomentComponent
    QuestionComponent
    YourNameComponent
    PledgeComponent
    TypeawayComponent
    DropBombComponent
    TestComponent          ← declared but not rendered
```

## Routing

`kree.router.ts` declares a single `Route`:

```ts
[{ path: '', component: KreeComponent }]
```

and exports `routing = RouterModule.forChild(routes)`. **This is never
imported.** There is no `<router-outlet>` in any template. `KreeComponent`
is mounted directly via the `<app-kree>` element in `index.html`, so the
route is dead code.

## Data flow

There is no store, no service, no HTTP. Communication is strictly
parent→child via `@Input`, child→parent via `@Output`:

```
KreeComponent
  ├── ThisMomentComponent            emits `answered` → beginPledge=true
  │     ├── QuestionComponent x3     each emits `answered`
  │     │                            (wiring does the 3-step gating)
  └── PledgeComponent                shown when doPledge=true
        ├── YourNameComponent        emits `answered` → hasName=true
        ├── TypeawayComponent x many (finished events gate next line)
        └── DropBombComponent        for "TO DO"
```

The `NgRx` packages listed in `package.json` (`@ngrx/core`,
`@ngrx/effects`, `@ngrx/store`, `@ngrx/store-devtools`) are not used
anywhere in the kree/ tree — they are leftover from the starter.

## Build output (as of original)

`npm run build` runs:
1. `ng build --prod --sm=false --aot=true --output-path=dist/client`
2. `npm run _server:build` → `tsc -p ./server` → `dist/server/...`

Express is then expected to serve `dist/client` statically.
