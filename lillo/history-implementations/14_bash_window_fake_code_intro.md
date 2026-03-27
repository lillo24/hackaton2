# Challenge 1 UI — Bash-Looking Fake Code Window Intro

This step only covers the **first pre-intro animation**:

- a terminal-like window appears on the **left of the phone**
- it starts when the user clicks the screen or presses space
- fake code / logs run in a visually cool way
- for now, stop here
- do **not** yet implement collapse into bubble, line branching, or CSV opening

---

## Goal

Add a **fake Bash / terminal window** that feels like:
- data ingestion
- simulation / computation
- technical processing before the alert arrives

It should look impressive in a pitch, but remain:
- readable
- deterministic
- easy to replay
- not dependent on real execution

---

## Correct product choice

Do **not** run real scripts in the browser.
Do **not** generate fully random text on every frame.

Use a **scripted fake sequence** of terminal lines.

Why:
- real-time fake randomness often looks messy, not smart
- a deterministic sequence is more cinematic
- much safer for a live demo
- easier to sync later with collapse → bubble → phone vibration → CSV reveal

---

## Visual placement

Layout for this step:

- phone stays centered
- terminal window appears on the **left side**
- it should not touch the phone
- keep enough breathing room so later the bubble/line animation can live between them

Think of the terminal as a “processing source” node.

---

## What to build now

### 1. Add a new intro layer before the phone startup flow

Create a new stage before the existing phone notification intro.

Suggested high-level intro sequence:

1. idle
2. terminal visible
3. terminal running
4. terminal done

For now, after `terminal done`, you can either:
- pause there
- or hand control back to the existing intro later

Do not wire the later steps yet if it complicates this part.

---

### 2. Start interaction

The terminal sequence should start when the user:
- clicks anywhere useful in the presentation area
- or presses `Space`

This is good for live pitching because:
- mouse click works for demos
- keyboard fallback is reliable

Important:
prevent accidental double-triggering.

Once started:
- ignore repeated triggers until sequence finishes or resets

---

### 3. Terminal window component

Create a dedicated component, likely something like:

- `IntroTerminal.jsx`

Responsibilities:
- render the fake Bash window
- animate line-by-line output
- expose `onComplete`
- remain presentation-only

Do **not** mix this into Dashboard or Alert pages.

Best place:
- same presentation shell / frame area where the phone intro lives

---

### 4. Terminal look

The terminal should feel like:
- hacker-ish, but clean
- modern, not meme-green-only
- credible enough for “simulation running”

Recommended structure:
- top bar with 3 small window dots
- title like `risk-sim.sh` or `unite-sim`
- dark panel body
- monospace font
- left-aligned output area
- maybe a blinking cursor at the last line

Keep the styling strong but minimal.

---

## Fake content style

The text should feel like:
- loading sensor streams
- merging weather + sensor data
- computing vineyard/farm risk
- preparing alert payload

Use short, punchy lines.
Avoid huge paragraphs.

Good categories of lines:
- boot / init
- loading modules
- reading inputs
- normalizing data
- running model
- computing score
- exporting output
- completion

---

## Good output structure

Use a sequence like this:

### Phase 1 — init
- starting pipeline
- loading config
- checking sensor channels

### Phase 2 — ingest
- air temp loaded
- soil temp loaded
- soil moisture loaded
- forecast pulled
- historical baseline loaded

### Phase 3 — compute
- normalizing values
- detecting anomaly window
- running risk model
- score updated

### Phase 4 — output
- alert threshold exceeded
- notification payload ready
- export prepared

This is much better than random “computer science nonsense”.

---

## Example line style

Use short lines like:

- `[init] loading simulation profile`
- `[sensor] air_temp stream online`
- `[sensor] soil_moisture stream online`
- `[meteo] forecast horizon loaded`
- `[calc] normalizing sensor ranges`
- `[calc] anomaly window detected`
- `[risk] frost_risk = 92`
- `[alert] critical notification prepared`

Do not overfill the screen.
Around 10–18 lines is enough.

---

## Animation behavior

### Line reveal
Use **line-by-line reveal**, not character-by-character for every line.

Why:
- line-by-line is cleaner
- easier to control timing
- looks more deliberate on stage

Optional:
within each line, a very short typing effect is fine for selected lines only.

### Cursor
A blinking cursor at the bottom helps sell the terminal look.

### Auto-scroll
If content exceeds the visible area:
- scroll softly downward
- do not snap aggressively

---

## Timing

Recommended pacing:
- first lines appear quickly
- middle compute phase slightly slower
- final result line gets a tiny pause

Suggested feel:
- total sequence around `3–5 seconds`
- enough to feel active
- not long enough to slow the pitch

Important:
the terminal is a setup effect, not the main show.

---

## State logic

Keep the logic simple.

Suggested states:
- `hidden`
- `visible`
- `running`
- `complete`

Suggested control:
- parent shell owns the current intro stage
- terminal receives `isActive`
- terminal internally reveals lines over time
- terminal calls `onComplete()` when done

This will make later chaining much easier.

---

## Suggested file changes

### `src/components/IntroTerminal.jsx`
Create:
- terminal window markup
- scripted lines array
- reveal animation logic
- optional blinking cursor
- completion callback

### `src/components/IntroTerminal.css`
Add:
- terminal body styling
- title bar styling
- text line styling
- reveal / fade / slight slide animation
- cursor blink animation

### parent presentation shell
Likely in:
- `PhoneFrame.jsx`
- or a higher preview shell

Add:
- trigger handling for click / space
- state deciding when terminal shows
- later hook for transition into the next animation

---

## Recommended implementation detail

Use a fixed array of objects like:

- `id`
- `text`
- `delay`

Example idea:
- each line has a reveal delay
- parent starts sequence
- component reveals lines in order
- no randomness required

This is the safest demo architecture.

---

## Design constraints

### Do
- make it cinematic
- make it readable from a distance
- keep the lines short
- use a deterministic sequence

### Do not
- simulate real shell commands too literally
- dump paragraphs of text
- use real backend execution
- overdo glitches/noise
- let it steal too much attention from the phone

---

## Demo safety checks

Before moving to the next step, make sure:

1. the terminal always starts reliably
2. space and click do not trigger twice
3. the sequence completes in the same way every time
4. it still looks good on the actual projector / laptop resolution
5. the text is readable from a few meters away

---

## Success criteria

This step is done when:

- a Bash-looking terminal appears on the left of the phone
- click or space starts the sequence
- fake processing lines run in a polished way
- the output feels relevant to the alert system
- the result looks “computer science cool” without becoming parody
- the architecture is ready for the next step: collapse into bubble

---

## Small but important critique

The risky mistake here would be trying to make the terminal “too realistic”.
That usually hurts the pitch.

The winning version is:
- short
- controlled
- believable
- clearly tied to your product logic

So treat it as a **cinematic simulation of processing**, not as an actual developer console.

---

## At the end, briefly report

1. where the terminal component was mounted
2. how the click / space trigger works
3. how the fake line sequence is structured
4. how ready it is for the next collapse-to-bubble step