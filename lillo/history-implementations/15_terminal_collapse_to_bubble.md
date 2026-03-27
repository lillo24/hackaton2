# Challenge 1 UI — Terminal Collapse into Bubble

This step extends the existing fake Bash window intro.

New requirements:
- the terminal must sit **centered between the left edge and the phone**
- it should be **wider**, more like a horizontal rectangular window
- after the fake code finishes, the terminal should **collapse vertically toward its center**
- the collapsed result becomes a **bubble / node**
- for now, stop there
- do **not** yet draw the outgoing lines to the phone and to the CSV

---

## Goal

Turn the terminal from a simple left-side visual into a proper **processing node** in the pitch flow:

1. user starts the intro
2. terminal runs the fake simulation
3. terminal compresses into a compact bubble
4. that bubble becomes the future branching origin for the next step

This matters because the collapse gives a clear visual meaning:
- wide window = raw computation
- compact bubble = processed output / decision node

---

## Important design correction

Do **not** just scale the terminal down uniformly.

That would look like:
- a shrinking card
- not a meaningful “collapse”

Instead:
- keep the **horizontal presence**
- collapse the **height inward from top and bottom toward the center**
- then transition into a bubble

The right mental model is:
**window content compresses into a single core node**.

---

## Layout update

### Terminal position
Move the terminal so it is:

- horizontally centered in the space between:
  - the left edge of the presentation area
  - the left side of the phone

This is better than pushing it too far left, because:
- it reads as part of the same system
- it leaves room for future connecting lines
- it looks more intentional on stage

### Terminal proportions
Make it:
- clearly wider than before
- more rectangular
- less like a square popup

Suggested feel:
- width significantly larger than height
- enough space to show 1–2 short columns worth of terminal lines visually
- still smaller than the phone, so the phone remains the hero

---

## What to build now

### 1. Keep the same intro trigger
No change:
- click or `Space` starts the sequence
- terminal appears
- fake code runs

### 2. Add a post-run collapse stage
After the final terminal line appears:
- hold briefly
- trigger collapse animation
- convert the terminal into a bubble

Suggested stage model:
- `hidden`
- `visible`
- `running`
- `collapsing`
- `bubble`

Do not overcomplicate it beyond that.

---

## Visual behavior

### Phase A — terminal running
Use the already-built Bash-like rectangular window:
- wide rectangular terminal
- clean title bar
- fake code/log lines
- blinking cursor if already present

### Phase B — terminal freeze
When the fake code sequence finishes:
- stop the cursor or reduce its prominence
- hold the finished window for a short beat
- let the user register that processing completed

### Phase C — vertical collapse
Animate the window so that:
- the top edge moves downward
- the bottom edge moves upward
- the shape compresses toward its vertical center
- width mostly stays present at first

During this:
- content should fade or mask away
- avoid trying to individually animate every line
- the collapse should feel like the terminal is being “compressed into a core”

### Phase D — bubble resolution
At the end of the collapse:
- the remaining shape resolves into a small bubble / node
- bubble sits approximately at the **center point of the former terminal**
- bubble becomes visually stable
- this will be the anchor for the next line-branch animation

---

## Animation style

### Collapse feel
Aim for:
- smooth
- slightly satisfying
- precise
- not cartoony

A good version is:
- quick compression
- tiny easing at the end
- then a clean settle into the bubble

### Avoid
- chaotic squash/stretch
- bounce-heavy cartoon motion
- full fade-out then separate bubble appearing from nowhere

The user should understand:
**the terminal became the bubble**.

---

## Best technical approach

Use a single component with staged class changes, rather than destroying and recreating multiple elements mid-animation.

Best pattern:
- terminal wrapper remains mounted
- apply state-based classes:
  - running
  - collapsing
  - bubble
- inner terminal content fades/masks
- outer shell morphs into the bubble

Why this is safer:
- easier to control
- easier to line up later with outgoing connectors
- avoids jarring DOM swaps

---

## Recommended component structure

### `IntroTerminal.jsx`
Keep one root wrapper responsible for:
- terminal position
- running lines
- collapse trigger
- final bubble state

Possible structure:
- outer intro terminal wrapper
- terminal shell
- title bar
- terminal body
- content lines
- bubble core state

The bubble should come from the same root element, not from a totally separate detached object.

---

## Suggested CSS behavior

### Wide terminal shell
Adjust styling so the terminal feels more rectangular:
- larger width
- slightly lower height proportionally
- enough padding to feel deliberate
- still compact enough for the pitch frame

### Collapse animation
Use a state-based animation that:
- reduces terminal body height strongly
- compresses the shell vertically
- rounds the shape progressively
- fades terminal text
- hides overflow cleanly

### Bubble state
Final bubble should:
- be compact
- look intentional
- be visually strong enough to later emit lines
- not be too tiny to notice from a distance

---

## Positioning rules

The terminal+bubble system should be positioned relative to the phone frame layout, not absolute to the whole browser in a brittle way.

Best approach:
- parent shell defines the presentation area
- phone remains the central anchor
- terminal wrapper is positioned in the left-side zone between screen edge and phone
- bubble inherits that same anchor zone

This matters because later the bubble must connect to:
- the phone on the right
- the CSV panel further right after passing behind the phone

If the anchor is sloppy now, the next step will be painful.

---

## Timing

Recommended pacing:
- terminal run: unchanged
- end pause: short beat
- collapse: fast but readable
- bubble settle: brief pause

The risky mistake is making the collapse too slow.
This is a transition, not the main attraction.

---

## Interaction constraints

While collapsing:
- ignore repeated click/space triggers
- do not allow restart mid-animation unless you intentionally built a reset
- final state should be stable and predictable

For pitch reliability:
- sequence should always end with the bubble in the exact same place

---

## Suggested file changes

### `src/components/IntroTerminal.jsx`
Update:
- support new states: `collapsing`, `bubble`
- call collapse after fake logs finish
- keep root wrapper mounted through the morph
- expose completion callback once bubble state is reached

### `src/components/IntroTerminal.css`
Update:
- terminal width / aspect ratio
- centered-between-left-edge-and-phone placement
- vertical collapse keyframes or transition classes
- text fade/mask during collapse
- bubble end-state styling

### presentation shell / parent intro controller
Update only as needed:
- wait for terminal to reach `bubble`
- then stop there for now
- prepare later hook for branch-line animation

---

## Strong recommendation

Do not try to animate the terminal into a super-detailed glowing orb yet.

That is polish too early.

The winning version now is:
- wide terminal
- centered in the left-side gap
- elegant vertical collapse
- clean bubble endpoint

That is enough to support the next step.

---

## Success criteria

This step is done when:

- the terminal is wider and more rectangular
- it sits centered between the left edge and the phone
- fake code runs as before
- after completion, the terminal collapses vertically inward
- the collapse resolves into a stable bubble
- it clearly feels like the bubble came from the terminal
- the bubble is positioned well for the future branch-line animation

---

## What not to do yet

Do not yet implement:
- horizontal line growth
- branch splitting
- phone vibration trigger from the bubble
- line passing behind the phone
- CSV window opening on the right

Just stop cleanly at the bubble.

---

## At the end, briefly report

1. how the terminal was repositioned relative to the phone
2. how the rectangular sizing was changed
3. how the collapse works technically
4. whether the final bubble is ready to be used as the branching origin in the next step