# Challenge 1 UI — Profile Visual Refresh (Updated Structure)

You are working on the existing Challenge 1 frontend.

Important context:
A navigation refactor was already completed.

The current app structure is now:
- Dashboard = future placeholder page
- Alerts = alerts list
- Alert = dedicated alert detail page
- Profile = dedicated read-only profile/context page

So this task is NOT about onboarding, and NOT about making Profile the main page.

## Goal
Refresh the visual design of the **Profile** page using the screenshots in the repo as style inspiration.

The Profile page should feel:
- calm
- agritech
- clean
- slightly premium
- readable
- secondary to the alert flow

Important:
This is a **read-only context page**.
It should communicate:
"Here is the current farm/profile context the app is using."

Do NOT make it feel like:
- onboarding
- setup wizard
- dashboard-first product
- game UI
- settings-heavy admin page

---

## References
There are two screenshots in the repo.
Use them as inspiration only.

Use them for:
- spacing
- card softness
- muted agritech palette
- chart/card composition
- premium but quiet visual hierarchy

Do NOT copy them literally.
Do NOT import unrelated dashboard complexity.

---

## Visual direction brief

Build the Profile UI with a calm agritech style:

- soft cream / warm light background, not pure white
- deep desaturated green as primary brand color
- muted secondary greens / sage tones
- rounded cards
- soft borders
- very subtle shadows
- simple icons
- elegant but readable typography
- generous spacing

Important constraints:
- this app is still alert-focused
- visuals must support readability
- avoid clutter
- avoid dense enterprise dashboard look
- avoid cartoonish style
- avoid over-designed “game-like” elements

---

## Current role of the Profile page

The Profile page is now a **read-only page fetched from profile/context data**.

It should show a simplified summary of the current profile/farm context.

Focus especially on this context:
- Unite
- 3 IoT:
  - Air temperature
  - Soil temperature
  - Soil moisture
- Weather
- Satellite

The page should feel like:
"These are the current data sources and farm context the app is using."

---

## Page content direction

Keep the Profile page simplified and not too dense.

Good content blocks could be:

### 1. Top profile summary
A clean summary card with:
- farm/company/profile name
- role / user type
- farm type
- maybe a small operating note

Keep it simple and elegant.

### 2. Connected sources summary
A card showing the active data sources used by the product:
- Air temperature sensor
- Soil temperature sensor
- Soil moisture sensor
- Weather
- Satellite

This can be visual but compact.
Do NOT make it feel like a technical integrations page.

### 3. Basic farm context
A small card/section with:
- number of plots/fields
- crop/farm type
- maybe one short contextual operational note

### 4. Supporting visual cards
Use a small number of refined supporting cards inspired by the screenshots.

Do not overload the page.

---

## Components I want

### 1. Water level card
Create a reusable card with a smooth line graph.

Requirements:
- line should look soft and fluid, like a wave
- show past days on the x-axis
- minimal chart style
- very light background
- one clean accent line
- no noisy grid
- calm elegant feel

Important:
- keep chart simple
- do not make it look like a heavy BI dashboard chart

### 2. Soil moisture card
Create a reusable card with 3 vertical pillars/bars.

Requirements:
- each pillar has a light full-capacity background
- inside it, a stronger colored fill shows the current value
- fill should feel solid and visually satisfying
- labels under each pillar
- simple and clean composition
- no dense chart-library feeling

### 3. Farm visual card
Create a small static isometric farm illustration card.

Requirements:
- very simple stylized farm scene
- slight indie-game inspiration only in clarity, not in overall UI tone
- no interaction needed
- no real 3D engine
- can include simple trees, plot boundaries, and a few markers
- should look clean, stylized, and secondary
- must not dominate the page

Important:
This is a support visual, not the centerpiece.

---

## Reusable style tokens
Use or define reusable patterns for:
- card radius: large
- button radius: soft/rounded
- border color: subtle warm gray-green
- shadows: minimal
- spacing: generous
- typography: elegant but readable
- alert colors remain separate from brand green
- yellow/orange/red remain for alert severity only

---

## Reuse rules
Do NOT suddenly restyle the whole app into a dashboard.
Do NOT spread these visuals everywhere blindly.

Instead:
- use this page to establish a calmer premium card language
- allow small reusable improvements for shared cards/components if useful
- keep Alerts and Alert page cleaner and more operational

The Profile page should look refined, but should not compete with the alert workflow.

---

## Scope boundaries

You may update:
- Profile page UI
- small shared card components
- small chart/visual components
- shared spacing/style tokens if useful

You may lightly improve shared card language if it helps consistency.

Do NOT:
- rebuild routing
- change app structure
- reintroduce onboarding
- turn Profile into a settings page
- add heavy forms
- create a dense integrations/config page
- redesign the whole product around dashboard visuals

---

## Design priority
The main value of the app is still:
- prioritized alerts
- alert explanation
- recommended action

So the Profile page should support the product story by making the farm/context feel believable and polished.

---

## Success criteria
At the end:
- Profile feels calmer and more premium
- it clearly reads as a read-only context page
- the screenshots influenced style but were not copied literally
- the page is cleaner and more elegant
- the app still feels alert-first overall

---

## At the end, briefly report
1. which visual ideas were taken from the screenshots
2. which new/reusable components were created
3. how the Profile page changed
4. what was intentionally kept restrained so the app stays alert-focused