# User flow (original)

The original Kree has exactly one linear flow. The user never navigates,
never logs in, never submits to a server. The experience is paced by
`setTimeout` chains, not by user clicks.

## Phase 0 — First paint

- Page loads, body is black, font is Gotham.
- The `<app-kree>` element is rendered; `ThisMomentComponent` is
  mounted. Everything else is hidden.

## Phase 1 — "Pause. Take a breath."  (≈ 0 – 5.5 s)

| Time  | What happens                                                   |
|-------|----------------------------------------------------------------|
| 0.0 s | Blank page, black background                                   |
| 1.5 s | `Pause.` fades in                                              |
| 3.5 s | `Take a breath.` fades in below it                             |
| 5.5 s | Both lines fade out; the questions block appears               |

The user does nothing during this phase — it is purely atmospheric.

## Phase 2 — "Where / When / What"  (≈ 5.5 – 25 s)

Three `<question>` components appear in sequence. Each one:

1. Types its question character-by-character over ~1–2 seconds.
2. Pulses `???` at the end (three toggles).
3. Fades in its pre-written answer.
4. Pulses the answer for 3 seconds.
5. Auto-clicks after 1.5 more seconds (or the user can click it).

| Question           | Pre-written answer |
|--------------------|--------------------|
| Where are you      | Here               |
| What time is it?   | Now                |
| What are you?      | This moment        |

When the third question auto-answers, `ThisMomentComponent.next()`
runs: it adds `fadeOut` to each `.q`/`.a` element and, 2.5 s later,
emits `answered`, which flips `beginPledge` on the root component.

## Phase 3 — "Take a pledge" button  (≈ 25 s – user click)

- A large bordered button **"Take a pledge"** fades in, offset over
  a black rectangle + candle GIF background.
- The button waits forever. Clicking it sets `doPledge = true`.
- `ThisMomentComponent` is destroyed; `PledgeComponent` is rendered.

## Phase 4 — "I" in five scripts → name input  (≈ +10 s + user input)

Inside `PledgeComponent`, the first child is `<your-name>`, which:

1. Cycles the word "I" through five scripts (Latin / Devanagari /
   Gurmukhi / Kannada / Urdu), each visible for ~2 s with fade in/out.
2. After the last script, `inputVisible = true`. An input with
   placeholder `"Full Name"` slides out to width 300 px, prefixed by
   `"I "`.
3. The user types their name. After any 3-second pause in typing,
   `moveOn()` runs (pressing Enter also triggers it).
4. The trailing span `" am here now."` fades in.
5. `hasName` flips, revealing the pledge block.

## Phase 5 — The pledge itself  (≈ +15 s, all automatic)

Once `hasName` is true, the pledge block plays line by line. Each
`<typeaway>` emits `finished` when done and the next flag is set:

1. **`At this moment, I pledge`** — typed with a comma-pause.
2. **`TO DO`** — dropped in by `<drop-bomb>`.
3. **`good`** — typed, then
4. **`great`** — typed.
5. **`BECAUSE`** — typed.
6. **`I can.`** — typed.
7. **`I want to.`** — typed.
8. **`I need to.`** — typed, and the flow stops here.

There is no "done" screen, no CTA, no reset. The user sits with their
pledge on screen and, eventually, navigates away.

## Total running time

End-to-end (not counting how long the user lingers on the name input
and the final pledge), the scripted path is **~60–90 seconds**. The
pacing is deliberately slow; almost every transition is ≥ 1 second.
