# Build & run (original)

These are the commands the original `package.json` expected you to
run. **Do not run them on a modern Node/npm — they will fail.** The
pinned versions (`@angular/cli@1.0.0-beta.31`, `typescript@2.1.x`,
`karma@1.2.0`, `protractor@4.0.9`) are incompatible with Node 16+.

This file is historical documentation only. For the working
toolchain, see `../baseline-with-Angular17/`.

## Scripts (from `package.json`)

| Script         | Command                                                                                      |
|----------------|----------------------------------------------------------------------------------------------|
| `start`        | `concurrently "ng serve --aot=true --proxy-config proxy.conf.json" "npm run _server:run"`    |
| `build`        | `ng build --prod --sm=false --aot=true --output-path=dist/client && npm run _server:build`  |
| `_server:run`  | `tsc -p ./server && concurrently "tsc -w -p ./server" "nodemon dist/server/bin/www.js"`      |
| `_server:build`| `tsc -p ./server`                                                                            |
| `test`         | `ng test --watch=false`                                                                      |
| `e2e`          | `protractor`                                                                                 |
| `lint`         | `tslint "src/**/*.ts"`                                                                       |
| `postinstall`  | `npm run build`                                                                              |

## Expected layout after `npm run build`

```
dist/
├── client/      # ng build output, served statically
│   ├── index.html
│   ├── main.*.bundle.js
│   └── assets/
└── server/      # tsc output of the Express server
    └── bin/www.js
```

Express (in `server/`) boots from `dist/server/bin/www.js`, serves
`dist/client` as static content, and exposes no real API routes for
the Kree experience — the SPA is self-contained.

## Environments

`src/environments/environment.ts` (dev) and
`environment.prod.ts` (prod) are selected by the CLI via
`angular-cli.json`'s `apps[0].environments` block. Neither is used by
any Kree code in practice — the flow has no feature flags.

## Proxy

`proxy.conf.json` proxies `/api/*` to the local Express server during
`ng serve`. Since Kree makes no HTTP calls, this too is vestigial.
