# Challenge 1 UI — Pitch Startup Notification Sequence

You are working on the existing Challenge 1 frontend.

This task adds a new **opening animation for the live pitch demo**.

It should support the product story:
- alert arrives
- phone reacts
- user opens it
- app becomes the dashboard entry point

This fits the Challenge 1 focus on prioritized alerts and actionable notifications, and it also matches the current draft direction that explicitly calls for phone vibration inside the demo flow. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

## Goal

Create a **fake phone startup / lock-screen alert sequence** at the beginning of the demo.

Sequence:
1. Phone looks off / asleep
2. A new alert arrives
3. Phone frame vibrates subtly
4. Screen turns on into a **fake lock screen**
5. A fake notification is visible on that lock screen
6. Clicking the notification unlocks the phone
7. Lock screen slides up in a very simple way
8. The app lands on the **Dashboard** page

Important:
- this is **not** a real OS recreation
- this is a **demo illusion layer**
- keep it elegant, readable, and easy to control during the pitch

---

## Product / UX intent

The point is not technical realism.
The point is to make the first 5–8 seconds of the pitch instantly understandable:

- something important happened
- the system noticed it
- the farmer is notified
- the app opens directly into the product

So optimize for:
- clarity
- visual impact
- reliability in demo
- very low interaction complexity

---

## Best architecture choice

Do **not** implement this inside `DashboardPage`.

Implement it as a **presentation layer around the app content**, because:
- the phone frame already wraps the whole preview
- the lock screen is outside the app, conceptually
- it avoids polluting dashboard logic with fake OS state
- it lets the whole sequence be reused or skipped cleanly

So the feature should likely live around:
- `PhoneFrame.jsx`
- `PhoneFrame.css`
- possibly `AppShell.jsx`

The actual routed app should only appear once the unlock sequence is complete.

---

## Implementation approach

### 1. Add a small startup state machine

Create a simple controlled sequence with states like:

- `off`
- `vibrating`
- `lockscreen`
- `unlocking`
- `app`

Keep it very small and deterministic.

Suggested behavior:
- initial state: `off`
- after a short delay, trigger `vibrating`
- then show `lockscreen`
- clicking the notification moves to `unlocking`
- after unlock animation completes, switch to `app`

Avoid overengineering.
A few `useState` + `useEffect` timers are enough.

---

### 2. Split phone display into two layers

Inside the phone screen, support two top-level visual layers:

#### A. Startup / lock layer
Used for:
- off screen
- wake up
- lock screen
- notification
- unlock animation

#### B. App layer
Used for:
- the real routed app UI
- dashboard / alerts / profile navigation as usual

The lock layer should sit above the app layer and disappear once unlocked.

---

### 3. Off-screen visual

When the phone is “off”:
- screen should be very dark, almost black
- keep a tiny bit of reflective gradient or soft vignette so it does not look broken
- no nav bar, no app content visible

This should feel like the phone is sleeping, not like the component failed to render.

---

### 4. Vibration animation

When the alert arrives:
- animate the **phone body / frame**, not the internal content only
- keep it short and cute
- small horizontal shake + tiny rotation is enough
- avoid exaggerated meme-level shaking

Suggested feel:
- duration around `500–800ms`
- 4–6 micro-movements
- settle cleanly before the lock screen becomes readable

Important:
the vibration should suggest a notification, not panic.

---

### 5. Fake lock screen

After vibration:
- wake the screen up
- show a minimal lock screen overlay

Keep it simple:
- soft wallpaper or blurred gradient background
- time text
- tiny “swipe up to open” feel is optional
- one clear notification card

Do **not** build fake status bar complexity unless already trivial.

The lock screen only needs enough detail to sell the idea.

---

### 6. Notification card

The notification is the key visual element.

It should:
- look distinct from the background
- contain your app identity
- mention the alert clearly
- be clickable/tappable

Suggested content:
- app name
- risk level badge
- short title
- one-line reason

Example structure:
- `Unite`
- `Critical alert`
- `Frost risk in Vineyard North`
- `Low overnight temperature + weak wind + high humidity`

Keep it short enough to read instantly during the pitch.

---

### 7. Unlock interaction

When clicking the notification:
- start a very simple unlock animation
- the lock screen slides upward
- the app underneath becomes visible

This should feel like:
- fake lock screen moving away
- app already ready under it

Do not simulate passcode, Face ID, or anything elaborate.

---

### 8. Landing behavior

After unlock:
- route / land on `/dashboard`
- the dashboard should be the first visible app screen
- the app should feel already active, not loading

Optional:
- after the dashboard appears, allow normal navigation immediately

Important:
the sequence should not trap the user.
Once unlocked, the product should behave normally.

---

## Controls / demo reliability

Add a simple way to control the sequence for demo use.

Recommended:
- a boolean like `enableStartupSequence`
- maybe a `Replay intro` button only visible in development / preview shell
- or auto-run only in phone preview mode

At minimum:
- easy to replay during rehearsal
- easy to bypass if it becomes annoying during normal UI work

This matters because pitch animations are fragile if they cannot be reset quickly.

---

## Suggested file changes

### `src/components/PhoneFrame.jsx`
Add:
- startup sequence state
- lock screen overlay markup
- conditional rendering of off / lock / app states
- notification click handler
- optional replay handler

### `src/components/PhoneFrame.css`
Add:
- off-screen styling
- vibration keyframes
- lock screen styling
- notification card styling
- unlock slide-up animation
- overlay layering

### `src/layout/AppShell.jsx`
Only if useful:
- pass a prop to enable/disable intro sequence
- add a replay trigger in preview shell
- ensure dashboard is the starting route for the real app

Do not spread this logic across many pages.

---

## Visual rules

### Keep
- polished
- calm
- readable
- demo-friendly

### Avoid
- rebuilding the mobile OS
- too many fake system details
- long loading spinners
- complex gesture logic
- multiple notifications at once
- anything that distracts from the app reveal

---

## Edge cases

Handle these cleanly:

1. **If the sequence is skipped**
   - show the app directly

2. **If the user clicks before lock screen is fully visible**
   - either ignore until ready, or transition safely

3. **If the route changes later**
   - intro should not replay unexpectedly during normal app navigation

4. **If preview mode changes**
   - phone intro should not break desktop or roadmap modes

5. **If animations are interrupted**
   - final stable state should still be the app on dashboard

---

## Success criteria

The result is successful if:

- the phone appears asleep at first
- an alert arrival is immediately understandable
- the vibration feels cute, not chaotic
- the fake lock screen is simple but believable
- clicking the notification cleanly reveals the app
- the app lands on dashboard without awkward delay
- the whole thing feels like a polished pitch opener, not a hacked overlay

---

## Nice optional polish

Only add these if quick and safe:

- subtle screen glow when waking up
- tiny scale/fade on the notification card
- soft blur behind the lock screen content
- a replay button in the preview shell
- notification text derived from one real mock alert

Do not add them if they increase fragility.

---

## Constraints

- no backend
- no real OS recreation
- no major router rewrite
- no breaking normal app navigation
- no heavy dependency addition for a simple animation task

---

## At the end, briefly report

1. where the startup sequence state lives
2. how the off → vibrate → lock → unlock → dashboard flow works
3. what controls exist to replay or skip the intro
4. what was done to keep it robust for the live pitch