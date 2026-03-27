# Challenge 1 UI — Bubble to Phone Trigger

This step continues the existing intro flow.

Current flow:
- source icons feed the terminal
- terminal runs fake code
- terminal collapses into a bubble

New requirement:
- after the bubble forms, it should create **one line to the phone**
- when that line touches the phone, the phone should **vibrate**
- that touch should then **start the existing phone startup sequence**
- also simplify the source icon styling above the terminal
- the downward feed lines can stay **gray**

For now:
- only do the **bubble → phone connection**
- do **not** yet branch to the CSV on the right

---

## Goal

Make the transition feel causal:

1. data sources feed the terminal
2. terminal processes data
3. terminal collapses into a bubble
4. bubble sends the result to the phone
5. phone receives it
6. phone vibrates and starts the lock-screen notification sequence

This is the missing bridge between the “computation” part and the “alert arrives on the phone” part.

---

## Important design rule

Do **not** start the phone sequence immediately when the bubble appears.

The phone sequence should start **only when the line visually reaches the phone**.

That contact moment is the whole point.
It creates a clean cause → effect transition.

---

## What to build now

### 1. Add a post-bubble connector phase
Extend the intro sequence so it becomes:

- hidden
- sources
- feeding
- running
- collapsing
- bubble
- connectingToPhone
- handoffToPhone

Meaning:
- `bubble`: bubble exists and settles
- `connectingToPhone`: one line grows from bubble toward phone
- `handoffToPhone`: once line touches phone, trigger vibration / startup sequence

Keep this simple.
No branching yet.

---

### 2. Draw one line from bubble to phone
After the bubble settles:
- hold a very short beat
- start one horizontal or slightly diagonal line from the bubble toward the phone

The line should:
- feel clean
- grow progressively
- not appear instantly
- end at a precise point on the phone edge

Best target:
- left edge / left-middle area of the phone frame or screen area

Do not aim vaguely at the center of the stage.

---

### 3. When the line touches the phone
At the moment the line reaches the phone:
- trigger the phone vibration
- then start the existing fake lock-screen / notification startup flow

This should be a real handoff:
- the intro overlay caused the phone event
- the phone did not animate on its own

---

## Best architecture choice

### Decouple the intro from the phone, but allow one trigger callback
The intro overlay should **not** own the whole phone animation logic.

Instead:
- the intro overlay controls everything up to the line touching the phone
- once contact happens, it calls something like:
  - `onPhoneTrigger()`
  - or `onIntroHandoff()`

Then the phone startup flow begins in the phone layer / shell logic.

That keeps the structure clean:
- intro overlay = source/terminal/bubble/connector
- phone shell = vibration + wake + lock screen + unlock + app

---

## Implementation approach

### In the parent shell
The parent stage should coordinate both systems:

- intro sequence
- phone startup sequence

Suggested parent flags:
- `introStarted`
- `phoneStartupStarted`

Flow:
- intro runs normally
- intro reaches phone contact
- parent receives callback
- parent starts phone startup
- intro overlay can stay visible briefly or fade as needed

Do not restart the intro at that point.

---

### In the intro component
Keep the bubble mounted.
After bubble state:
- render a connector line layer
- animate line growth from bubble anchor to phone anchor
- when complete, call parent callback once

Protect against double-calls.

---

## Visual behavior

### Bubble
The bubble should remain stable while the line grows.
Do not make the bubble jump.

### Connector line
The line should:
- use the same minimal language as the other connectors
- be thin
- neutral
- readable from a distance

Good default:
- medium-light gray
- no flashy neon
- no heavy glow unless already subtle in your design system

### Phone reaction
As soon as the line touches:
- phone vibrates
- then wake/notification sequence starts

Do not add a long pause between touch and vibration.
The reaction should feel immediate.

---

## Styling corrections for the source icons

The icons above the terminal currently feel too colorful / noisy.

Change them to a more minimal style:
- neutral or monochrome base
- softer fill / background
- less saturated accents
- no strange highlight colors

Recommended direction:
- use low-contrast neutral surfaces
- icon glyph itself slightly darker
- very subtle pulse only
- keep them readable, not decorative

The goal is:
- “data source symbol”
not
- “bright floating sticker”

---

## Styling for the downward lines

Keep the icon-to-terminal feed lines gray.
That is a good choice.

Use the same family for the new bubble-to-phone line:
- gray
- thin
- minimal
- consistent

This helps the whole intro read as one system.

---

## Best technical choice for the lines

Use SVG for the bubble-to-phone connector as well.

Why:
- precise endpoint control
- easy animated growth
- consistent with the existing feed lines
- later reusable for the CSV branch

Recommended:
- same SVG overlay system
- one additional path from bubble anchor to phone anchor
- animate path length / dash offset

Do not switch to a totally different line method now.

---

## Positioning rules

The line must be anchored to real positions:
- bubble center
- phone target point

So compute:
- bubble anchor point from the intro overlay
- phone target point from the phone wrapper bounds

Do not hardcode a guessed `left: 63%` style endpoint.
That will break as soon as spacing changes.

---

## Timing

Recommended sequence:
1. bubble settles
2. very short pause
3. line grows to phone
4. touch moment
5. phone vibration starts immediately
6. startup sequence continues

Keep this tight.
This is a bridge, not a separate scene.

---

## Suggested file changes

### `src/layout/AppShell.jsx`
Update:
- keep phone centered as before
- pass phone bounds / anchor target to intro overlay
- add callback for intro → phone handoff
- start the existing phone startup flow only after intro handoff

### `src/components/IntroTerminal.jsx`
Update:
- add `connectingToPhone` phase after `bubble`
- render bubble-to-phone connector
- animate connector growth
- call `onPhoneTrigger` once on completion

### `src/components/IntroTerminal.css`
Update:
- line styling for bubble-to-phone connector
- minimal source icon styling
- keep gray feed lines
- preserve collapse/bubble behavior

### `src/layout/AppShell.css`
Only adjust if needed:
- make sure intro overlay and phone layer stack correctly
- ensure connector can visually reach the phone without clipping

---

## State flow suggestion

A simple clean flow is:

- `idle`
- `sources`
- `feeding`
- `running`
- `collapsing`
- `bubble`
- `connecting`
- `complete`

And separately for the phone:
- `off`
- `vibrating`
- `lockscreen`
- `unlocking`
- `app`

Connection:
- intro `connecting` completes
- parent triggers phone `vibrating`

That separation is good and robust.

---

## Success criteria

This step is done when:

- after collapsing, the bubble does not just stop
- one connector line grows from the bubble to the phone
- the line reaches the phone cleanly
- the phone vibrates exactly when the line touches
- the existing startup sequence begins from that touch
- source icons above the terminal look more minimal
- the downward feed lines remain gray
- the phone stays centered throughout

---

## What not to do yet

Do not yet add:
- the branch that continues through the phone
- the line to the right-side CSV
- CSV reveal animation

Just make the left-side computation properly hand off into the phone.

---

## At the end, briefly report

1. how the bubble-to-phone anchor points are computed
2. how the intro hands off control to the phone startup sequence
3. what was simplified in the source icon styling
4. whether the bubble-to-phone line uses the same SVG system as the feed lines