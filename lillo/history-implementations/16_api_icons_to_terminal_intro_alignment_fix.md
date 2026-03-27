# Challenge 1 UI — Fix Phone Alignment + API Icons Feeding the Terminal

This step fixes two real problems in the current intro and adds the next animation beat.

It also fits the Challenge 1 story better: the app is supposed to integrate **2–3 external data sources**, normalize them, and turn them into a prioritized alert hub. The intro should visibly show that flow instead of looking like isolated effects. :contentReference[oaicite:0]{index=0} The current design draft already frames the product as “3 IoT + meteo + satellite” and the core value as centralized integration before alerting. :contentReference[oaicite:1]{index=1}

---

## Goal

Fix the intro so that:

1. the **phone always stays perfectly centered** in the stage
2. the Bash/terminal window is **visually centered in the left gap** between:
   - the left edge of the stage
   - the left edge of the phone
3. the terminal becomes **bigger and wider**
4. before the terminal starts running, **3 data-source icons** appear above it
5. those icons pulse lightly
6. each icon sends a line downward into the terminal
7. only **after the three lines reach the terminal**, the fake code starts running

For this step, keep the existing collapse-to-bubble behavior after the terminal run.

---

## Important critique

The current layout approach is the wrong anchor for this animation.

Right now the terminal and the phone are sharing the same grid flow. That makes the phone shift when the intro becomes active. That is exactly the opposite of what you want in a pitch:
- the phone is the hero
- the phone must be immovable
- everything else should orbit around it

So the next change should **not** be “tweak the grid a bit more”.

It should be:

- **phone anchored independently at stage center**
- **intro elements positioned in a separate overlay layer**

That is the clean fix.

---

## Correct architecture

### 1. Keep the phone as the fixed anchor
The phone must remain centered in the middle of the stage at all times.

Implementation rule:
- render the phone in a centered layer
- do not let terminal width participate in phone centering
- no shared 3-column layout where intro width influences phone placement

Best mental model:
- **Layer A:** centered phone
- **Layer B:** intro overlay on top/around it
- **Layer C:** future connector lines / CSV reveal

---

### 2. Compute the left-gap anchor from the phone position
The terminal should not just be “somewhere left”.
It should be centered in the actual horizontal gap between:
- stage left edge
- phone left edge

So define a left intro zone using the phone’s real position.

Best practical approach:
- measure the phone frame bounds inside the stage
- derive:
  - `phoneLeft`
  - `leftGapCenter = phoneLeft / 2`
- position the terminal around that center

This is much safer than hardcoding guesses with `grid-template-columns`.

If you want a CSS-only fallback, it will be less precise.

---

## New sequence

### Desired order
1. stage idle
2. click / space starts intro
3. 3 icons appear above terminal zone
4. icons pulse lightly
5. 3 lines grow from icons into terminal
6. once all 3 lines connect, terminal starts fake code
7. terminal finishes
8. terminal collapses into bubble

This is a better narrative:
**sources → integration → processing → result**

That matches the hackathon problem statement much better than “terminal starts by itself.” 

---

## Layout plan

### Stage structure
Refactor the phone pitch stage into two independent layers:

#### Layer 1 — centered phone layer
Contains only:
- `PhoneFrame`

Behavior:
- always centered
- never affected by intro width
- same coordinates before, during, and after intro

#### Layer 2 — intro overlay layer
Contains:
- the 3 source icons
- the terminal
- later the bubble + branch lines + CSV panel

Behavior:
- absolute within the same stage
- positioned relative to stage bounds and measured phone position

This is the core fix.

---

## Terminal sizing and placement

### Sizing
Make the terminal:
- wider than now
- slightly taller if needed, but still mostly horizontal
- clearly a rectangular computation window

Suggested feel:
- width around 30–36rem range depending on viewport
- enough to read from a distance
- not wider than the whole left gap

### Position
Place the terminal:
- below the icons
- centered on the left-gap center
- vertically aligned around the phone mid-height or slightly above center

It should feel like a processing station feeding into the phone, not like a sidebar card.

---

## API/source icons

### What to use
Reuse the same 3 easily recognizable icon families already established in the profile area.

Use them as source metaphors, for example:
- sensor / IoT
- weather
- satellite

This is stronger than inventing new symbols, because it creates visual continuity across the product.

### Placement
Render the 3 icons:
- above the terminal
- horizontally spaced
- centered as a group over the terminal width

Good shape:
- small triad
- even spacing
- enough room for three connector lines to drop without overlap

### Style
They should:
- look active
- have a soft pulse
- feel like data sources, not buttons

Keep the pulse subtle.
Too much bounce will cheapen it.

---

## Line animation from icons to terminal

### What the lines should do
Each icon sends one line downward into the terminal.

Animation:
- line starts at the icon
- grows slowly toward the terminal
- all three lines can start together or slightly staggered
- when the final line touches the terminal, the terminal begins running

### Best technical choice
Use one small SVG overlay for these lines.

Why SVG:
- easier to draw precise connectors
- easy to animate path length
- cleaner than stacking multiple div lines
- much better for future branch animations

Recommended:
- compute icon anchor points
- compute target points on terminal top edge
- animate `stroke-dashoffset` or line length

---

## State machine update

Current flow is too narrow.
Extend it to something like:

- `hidden`
- `visible`
- `sources`
- `feeding`
- `running`
- `collapsing`
- `bubble`

Meaning:
- `visible`: terminal and source zone appear
- `sources`: icons pulse / settle
- `feeding`: lines animate into terminal
- `running`: terminal logs start
- `collapsing`: existing collapse animation
- `bubble`: final node

This is enough.
No need to overbuild a big state framework.

---

## Trigger behavior

### Start interaction
No change in principle:
- click stage
- or press `Space`

But the behavior changes to:
- trigger icons first
- not terminal logs immediately

So the click should move:
- `visible` → `sources` or directly into `feeding`

### Repeat protection
During:
- feeding
- running
- collapsing

ignore further clicks / space presses.

For pitch reliability, only allow:
- replay
- skip

not mid-sequence retriggers.

---

## Concrete implementation changes

### `AppShell.jsx`
Refactor the phone pitch stage so the phone is independent from intro layout.

Do this:
- create a centered phone layer
- create an overlay intro layer
- stop using the active intro grid to position the phone

Also:
- keep a ref to the stage
- keep a ref to the phone wrapper
- measure the phone bounds
- pass computed layout data to the intro overlay

Suggested passed data:
- `phoneLeft`
- `phoneCenterY`
- `stageWidth`
- maybe `leftZoneCenterX`

---

### `AppShell.css`
Replace the intro-active grid dependency with:

- a stage wrapper that is `position: relative`
- a centered phone wrapper using absolute or grid centering
- an intro overlay filling the stage

Key rule:
- `.phone-body` alignment must not change when intro starts

Also:
- expand the intro overlay width
- leave enough room above terminal for icons

---

### `IntroTerminal.jsx`
Extend the component to support:
- source icon row
- feeding lines
- delayed terminal start after line completion

Best internal structure:
- root intro overlay
- source icon strip
- connector SVG layer
- terminal window
- existing core bubble

Also:
- terminal logs should begin only after feeding completes

### `IntroTerminal.css`
Add:
- larger terminal width
- icon row styling
- pulse animation
- SVG line styling
- state-based visibility for sources/feeding/running

Keep:
- collapse animation mostly as-is

---

## Recommended visual timing

### Source icon phase
- icons appear and settle
- short pulse
- should last just enough to read “three inputs”

### Feeding phase
- lines grow slowly enough to be understood
- not so slow that the pitch stalls

### Terminal start
Start immediately after the third line reaches the terminal.
That “touch → run” moment is important.

It creates a clean cause/effect relationship.

---

## Small but important design choice

Do **not** draw the three lines into the middle of the terminal.

Better:
- let each line land on a different point along the terminal’s top edge

Why:
- visually clearer
- feels like multiple feeds entering the processor
- avoids messy overlap

So:
- left icon → upper-left terminal entry
- center icon → central entry
- right icon → upper-right terminal entry

---

## Reuse rule

Do not redraw three new random icons just because it is faster.

Reuse the same icon language from Profile:
- this improves consistency
- it quietly tells the jury “these are the same sources the app uses later”

That is good product storytelling, not just animation polish.

---

## Success criteria

This step is successful when:

- the phone remains perfectly centered before and after intro start
- activating the intro no longer moves the phone
- the terminal is clearly centered in the left gap
- the terminal is larger and more rectangular
- three recognizable source icons appear above it
- the icons pulse lightly
- three lines animate into the terminal
- the fake code starts only after those lines connect
- the terminal still collapses cleanly into the bubble

---

## What not to do yet

Do not yet add:
- bubble branching to the phone
- the line passing behind the phone
- CSV reveal on the right

First make this stage spatially correct and readable.
Otherwise the next animation will stack on a weak base.

---

## Brief report to return after implementation

1. how the phone was decoupled from intro layout
2. how the left-gap center is computed
3. which 3 icons were reused from Profile
4. how the icon → terminal line animation is timed
5. whether the bubble anchor still ends in a stable, repeatable position