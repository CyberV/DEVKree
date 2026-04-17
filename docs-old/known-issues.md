# Known issues in the original codebase

These are preserved as-is in the original source under `src/`. They
are not bugs "discovered and fixed" — they are documented here as
context for why the Angular 17 rewrite in `baseline-with-Angular17/`
does things slightly differently.

## 1. `KreeComponent.alert()` is broken

```ts
alert(){
  this.hand.nativeElement.css.top = '-20px';
}
```

- `ElementRef.nativeElement` has no `.css` property — this would
  throw at runtime.
- `@ViewChild('hand')` has no matching `#hand` in the template.
- The method is only referenced via `(hover)="alert('asd')"` in
  `kree.component.html`, but Angular has no `(hover)` event — it is
  silently ignored. So the method never actually runs.

## 2. `ThisMomentComponent.next()` mutates DOM directly

```ts
document.getElementsByClassName('q')[0].className += " fadeOut";
ans[1].style.marginTop = '-4em';
```

- `HTMLCollection` items are `Element`, not `HTMLElement`, so `.style`
  is a strict-TS error (the original TS 2.1 compiler let it through).
- This couples the component to DOM class names in its children —
  brittle. In the Angular 17 rewrite we flip a host `[fadingOut]`
  state and let the CSS do the fade.

## 3. `HttpModule` imported but unused

`KreeModule` imports `HttpModule` from `@angular/http`. Nothing in
`kree/` performs an HTTP call. `@angular/http` is also removed
entirely in Angular 5+, so this import is not just unused — it is
a blocker for upgrading.

## 4. `kree.router.ts` is never imported

`kree.router.ts` defines `RouterModule.forChild([...])` and exports
it as `routing`, but no module imports `routing`, and no template
contains a `<router-outlet>`. The file is completely dead.

## 5. `TestComponent` declared but never rendered

`TestComponent` (selector `my-test`) appears in `KreeModule.declarations`
but is never referenced in any template and has no content.

## 6. `private` fields used from templates

All of the `this-moment`, `question`, `your-name`, etc. components
declare their fields `private` in TypeScript, then read them from
their templates (`{{label}}`, `*ngIf="showAnswer"`, …). In Angular
CLI's current strict templates, this would be rejected. It worked
under TS 2.1 because the AOT compiler generated `.ngfactory` files
that called into the class directly. In the Angular 17 rewrite the
fields are made `public` (the default).

## 7. `NgRx` packages in dependencies are unused

`@ngrx/core`, `@ngrx/effects`, `@ngrx/store`, `@ngrx/store-devtools`,
`ngrx-store-freeze` — none of these are imported from anywhere in
`src/`. Leftover from the starter template.

## 8. `ngOnInit` `setTimeout` chains leak on destroy

None of the components store their `setTimeout` handles or cancel
them in `ngOnDestroy`. If `KreeComponent` is unmounted mid-flow,
pending timers still fire and can touch destroyed views. In the
original app the component is never unmounted, so this is never
observed — but it matters if you reuse these components.

## 9. Class fields declared but not used

- `QuestionComponent.exitInterval`
- `PledgeComponent.q`, `PledgeComponent.answer`, `PledgeComponent.exitInterval`,
  `PledgeComponent.hasName`, and the entire `showNextChar` /
  `toggleQuestionMark` chain.
- `YourNameComponent.then`, `now`, `showInterval`, `checkInterval`,
  `showInput()`.

Copy-paste scaffolding from earlier components that was never trimmed.
