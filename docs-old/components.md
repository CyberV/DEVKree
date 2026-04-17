# Components (original) — kree/

Every component lives under `src/app/kree`. None of them talk to a
service; they coordinate through `@Input`/`@Output` and a lot of
`setTimeout`.

## `KreeComponent` (root)

- **Selector:** `app-kree`
- **Template:** `kree.component.html`
- **Role:** Orchestrator for the top-level flow. Holds two booleans:
  - `beginPledge` — `false` until `ThisMomentComponent` finishes.
  - `doPledge` — flipped to `true` when the user clicks the "Take a
    pledge" button.
- **Template behaviour:**
  - `<this-moment>` is rendered while `!doPledge`, and its
    `(answered)` output flips `beginPledge`.
  - When `beginPledge && !doPledge`, a centered "Take a pledge" button
    is shown; clicking it sets `doPledge = true`.
  - When `doPledge`, `<pledge>` is rendered.
- **Dead code:**
  - `alert()` method references `this.hand.nativeElement.css.top`,
    which is not a valid DOM API; never called.
  - `@ViewChild('hand')` — no template element has `#hand`.

## `ThisMomentComponent`

- **Selector:** `this-moment`
- **Output:** `answered: EventEmitter`
- **State:**
  - `begin`, `paused`, `ready` — staged booleans that drive the
    "Pause." / "Take a breath." heading fade.
  - `firstAnswered`, `secondAnswered` — gate the three `<question>`
    instances so each one appears only after the previous emits.
  - `isMobile` — set from `window.innerWidth < 768` in `ngOnInit`,
    but not actually read by the template.
- **Timing (from `ngOnInit`):**
  - `t=1500ms` → `begin = true` ("Pause." fades in)
  - `t=3500ms` → `paused = true` ("Take a breath." fades in)
  - `t=5500ms` → `ready = true` (both headings fade out, questions
    block appears)
- **`next()`:** Called after the third question is answered. Walks
  the `.q` and `.a` DOM collections, adds `fadeOut` classes, then
  `setTimeout(2500)` emits `answered`.
  - **Bug:** `ans[1].style.marginTop = ...` — `HTMLCollection`
    elements do not expose `.style` directly on the collection index
    in strict TS; works at runtime because it is actually `Element`
    access in the compiled JS.

## `QuestionComponent`

- **Selector:** `question`
- **Inputs:** `q: string`, `answer: string`
- **Output:** `answered: EventEmitter`
- **Timers:** `startInterval=1000`, `promptInterval=3000`,
  `typeInterval=100`, `markInterval=500`.
- **Flow:**
  1. After 1s, `showNextChar()` types `q` character-by-character.
  2. When the question text is complete, `toggleQuestionMark()`
     appends/removes `?` three times (`markMax=3`) as a pulsing cue.
  3. After the third `?`, `showAnswer=true` (the answer fades in).
  4. After `promptInterval=3000ms`, `prompt=true` (the answer starts
     pulsing).
  5. After another `1500ms`, `onClick()` is called automatically —
     i.e. the question auto-answers itself even if the user does
     nothing. Clicking the answer triggers the same `onClick()`.
- **Notes:** Written as a "type-and-reveal" mini-component; the three
  instances in `this-moment.component.html` are hardcoded with
  `q`/`answer` pairs.

## `YourNameComponent`

- **Selector:** `your-name`
- **Output:** `answered: EventEmitter`
- **State:**
  - `mes = ['I', 'मैं', 'ਮੈਨੂੰ', 'ನಾನು', ' میں ']` — "I" in five scripts.
  - `currentMe` — index into `mes`.
  - `inputVisible`, `inputWidth`, `name`, `placeholder="Full Name"`.
- **Flow:**
  1. `nextMeText()` cycles through `mes`, toggling `entering`/`exiting`
     at 1 second intervals so each word fades in and out.
  2. When the end of the array is reached, the text input becomes
     visible, `inputWidth` animates from 0 → 300 px, and the input is
     programmatically `.click()`ed (focus cue).
  3. `checkName(key)` is called on every keystroke. It captures
     `this.name` into `this.tmp` and waits 3 seconds; if the name
     hasn't changed in that time, it calls `moveOn()`.
  4. `moveOn()` sets `hasName = true` and emits `answered`.
- **Bug:** `ElementRef` is used to reach across DOM with
  `getElementsByClassName('yourName')[0].click()` — fragile but works.

## `PledgeComponent`

- **Selector:** `pledge`
- **Inputs:** declares `q` and `answer` but they are unused — it is a
  copy-paste of `QuestionComponent`'s class skeleton.
- **Actual behaviour:** The template composes the pledge by rendering
  `<your-name>`, and then a chain of `<typeaway>` and `<drop-bomb>`
  instances gated on template-local flags (`drop`, `good`, `great`,
  `because`, `ican`, `iwant`, `ineed`). Each `(finished)` event flips
  the next flag, revealing the next line.
- The class's `ngOnInit` / `showNextChar` / `toggleQuestionMark` code
  is all dead — none of it is wired into the template.

## `TypeawayComponent`

- **Selector:** `typeaway`
- **Input:** `text: string` (default `"At this moment, I pledge"`)
- **Output:** `finished: EventEmitter`
- **Flow:** After `startInterval=2000ms`, `showNextChar()` types each
  character with `typeInterval=100ms`. When the current character is
  `,`, the delay before the *next* character is `8×typeInterval` —
  a deliberate "comma pause". When the text is fully typed, emits
  `finished`.

## `DropBombComponent`

- **Selector:** `drop-bomb`
- **Input:** `text: string`
- **Output:** `finished: EventEmitter`
- **Flow:** After `startInterval=2000ms`, `dropNextWord()` is called
  once and sets `label = text` in one go — despite the name and the
  loop shape, it does not animate per-word; the `.split(' ')` arrays
  are computed and discarded. Visually, the whole phrase "bombs in"
  at once. CSS handles the drop-in animation.
- The method recurses once and then emits `finished` on the next
  call.

## `TestComponent`

- **Selector:** `my-test`
- **Declared** in `KreeModule`, **never rendered**. Dead code.
