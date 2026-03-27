# Challenge 1 UI — Dashboard / Profile / Alert Navigation Refactor

You are working on the existing Challenge 1 frontend.

## Goal
Refactor the app structure so that:

1. the current main page is no longer the profile-like page
2. the main page becomes an empty placeholder for the future farmer dashboard
3. the current profile-like content is moved into a dedicated **Profile** page reachable from a **profile icon button**
4. there is also a dedicated **Alert** page/button
5. the dedicated Alert page shows the currently selected alert if the user came from the Alerts list
6. if the user opens the Alert page without coming from an alert, show a quiet empty state (not an error)

Do NOT rebuild the app.
Do NOT redesign everything.
This is a navigation + page-role refactor.

---

## Main product structure after this change

### 1. Dashboard page
This becomes the main/home page.

For now:
- keep it intentionally mostly empty
- it is a placeholder for the future daily farmer dashboard
- do not fill it with fake widgets yet

It can have:
- a simple page title
- a short placeholder sentence like "Future daily summary for the farmer"
- maybe one subtle empty-state card

Important:
This page should feel intentionally reserved for the future, not broken.

### 2. Profile page
Move the current profile-like page here.

Important:
This page should be **simplified a lot**.
It should feel like a **read-only profile/context page**, not onboarding.

Do NOT keep the old page as a big selection-first experience.

Use the current data as if it were fetched from an external API.

Keep only the most useful basic values, especially around this context:
- Unite:
  - 3 IoT
    - Temperatura Aria
    - Temperatura Suolo
    - Umidità Suolo
  - Meteo
  - Satellite

Also keep whatever is still important from the current page, but simplify aggressively.

Suggested content for Profile:
- role / user type
- farm/company/profile name
- farm type
- connected data sources summary
- maybe field/plot context
- maybe one short operating focus note

Do NOT make it dense.
Do NOT keep many cards.
Do NOT make it editable-heavy.

This page should feel like:
"Here is the current farm/profile context the app is using."

### 3. Alert page
Create a dedicated **Alert** page/button.

Behavior:
- if the user clicked an alert from the Alerts list, this page shows that selected alert detail
- if the user open this page directly without selecting an alert first, show an empty/quiet placeholder
- do NOT show an error in that case
- do NOT invent random demo content if no alert is selected

The placeholder can say something like:
- "No alert selected yet"
- "Open an alert from the Alerts page to inspect details"

This page should be the dedicated destination for alert detail.

---

## Navigation changes

Refactor the app navigation so it includes clear buttons for:

- Dashboard
- Alerts
- Alert
- Profile

Important:
- use a **profile icon** for Profile
- use an alert-related icon for Alert
- use clean icon-based or icon+label navigation depending on what fits the current UI best
- do not add heavy visual clutter

If needed, keep labels small.
But the Profile entry should clearly read as a profile button.

Do not leave the old Farm Type page as the main nav item.

---

## Route behavior

Refactor routes so the app structure makes sense.

Suggested route shape:
- `/` or `/dashboard` -> Dashboard placeholder
- `/alerts` -> Alerts list
- `/alert` -> selected alert detail page or empty state
- `/profile` -> simplified read-only profile page

You may keep support for param-based alert routes if useful, but the important UX is:
- Alerts list click -> open dedicated Alert page
- Alert page without selected alert -> empty state

Important:
Prefer a clean selected-alert flow over keeping the old route shape unchanged.

---

## Selected alert state
Introduce or cleanly centralize the "currently selected alert" state.

Requirements:
- clicking an alert in the Alerts list should set the active alert
- the dedicated Alert page should render from that active alert
- if no active alert exists, render the empty placeholder
- preserve this state while navigating around the app during the session

Do not overengineer this.
Simple app-level state is enough.

---

## Profile page simplification guidance

The current page has too much of a profile-selection / onboarding feel.
Remove that feeling.

Please:
- remove the large farm-type chooser emphasis from the main flow
- do not present it as "choose your profile"
- instead present it as "current profile context"

A compact structure is enough, for example:
- top summary card
- connected sources card
- basic farm context card
- one short operational focus card

Keep it clean and minimal.

---

## Dashboard placeholder guidance

The main page should now be left open for the future farmer dashboard.

So:
- do not copy old profile content into it
- do not add fake summary widgets just to fill space
- keep it intentionally light and reserved

This is important:
the home page should now clearly feel like a placeholder for the future daily dashboard.

---

## Alert page guidance

Reuse as much as possible from the existing alert detail implementation.

Do NOT rebuild the detail page from zero if it already exists.

But change its behavior so:
- it works as a dedicated page in the main navigation
- it can render an empty state when there is no selected alert
- it feels like a stable destination, not only a drill-down edge case

---

## Files likely involved
You will probably need to update:
- App.jsx
- AppShell.jsx
- current FarmType page or replace it with a simplified Profile page
- AlertDetail page behavior
- Alerts page click behavior
- any small shared nav/icon components
- minimal mock/profile data if needed

You may rename files/routes if that makes the structure cleaner.

---

## Constraints
- do not redesign the whole visual system
- do not break phone mode
- do not break desktop mode
- do not add backend work
- do not turn profile into a full settings page
- do not add complex editing forms
- keep it demo-ready and simple

---

## Success criteria
At the end:
- the main page is an empty future dashboard placeholder
- profile is moved into its own simplified page
- profile is reachable from a profile button/icon
- there is a dedicated Alert page/button
- alert list can open that page with the selected alert
- opening Alert without a selected alert shows nothing/empty state instead of an error

---

## At the end, briefly report
1. what routes/navigation changed
2. how selected-alert state now works
3. how the old main/profile page was simplified
4. how the empty dashboard placeholder was implemented