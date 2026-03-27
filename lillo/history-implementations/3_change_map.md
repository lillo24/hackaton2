Change the customer dashboard farm map so it shows only 2 floating status markers instead of 4.

Goal:
On the dashboard farm/map card, do NOT show 4 floating thingies anymore.
Show only:
- 1 alert marker
- 1 okay marker

Keep the farm scene/parcels themselves. Only reduce the floating markers/status points.

Files to inspect:
- `src/pages/DashboardPage.jsx`
- `src/components/FarmProfileStage.jsx`
- `src/components/FarmVisualCard.jsx`
- `src/components/components.css`

What is happening now:
- `FarmVisualCard.jsx` currently has 4 parcel tile definitions.
- Each tile also renders a floating status marker, so the map shows 4 markers total:
  - 2 warning
  - 2 verified
- `DashboardPage.jsx` currently maps warning markers to:
  - `tile-2`
  - `tile-4`

What to change:

1. Keep the 4 parcel shapes, but render only 2 status markers total
- Do NOT remove the 4 map parcels.
- Do NOT redesign the farm scene.
- Only change the floating status marker layer.

2. New marker behavior
- Show exactly 2 floating markers:
  - one `warning` marker
  - one `verified` marker
- The warning marker should be the only clickable marker for opening an alert.
- The verified marker should be visual only and not clickable.

3. Clean implementation
- In `FarmVisualCard.jsx`, separate:
  - parcel/tile geometry
  - status-marker definitions
- Keep `tileDefinitions` for the 4 parcel polygons.
- Add a new small array for visible status markers, for example:
  - one warning marker near the parcel area that currently feels most relevant
  - one verified marker on a safer parcel
- Do not keep status rendering coupled 1:1 to every tile anymore.

4. Alert click wiring
- The single warning marker should open the first available mapped alert.
- If there is no alert assignment, the warning marker should not render as a broken clickable target.
- The verified marker should never open anything.

5. Dashboard assignment cleanup
- In `DashboardPage.jsx`, stop assigning 2 warning tiles.
- Replace the current `dashboardWarningTileIds = ['tile-2', 'tile-4']` logic with a single warning assignment.
- Use the first alert only.
- Keep the current alert detail navigation behavior unchanged.

6. Terrain treatments
- Do not break the parcel terrain rendering.
- It is fine if terrain treatments still exist on multiple tiles.
- This task is about reducing floating markers only, not rewriting the whole visual logic.

7. CSS cleanup
- Update any CSS that assumes 4 floating statuses / float-1..float-4 if needed.
- Keep motion subtle.
- Avoid dead CSS if some float variants become unused.

8. Verify
- Build the app.
- Confirm the customer dashboard map now shows only 2 floating markers total.
- Confirm one is alert/warning and clickable.
- Confirm one is okay/verified and non-clickable.
- Confirm no other dashboard content changes.

Deliver back:
1. files changed
2. short summary
3. exact marker positions chosen