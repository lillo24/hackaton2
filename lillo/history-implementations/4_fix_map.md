Adjust the 2 floating status markers on the customer dashboard farm map.

Goal:
Keep only the 2 markers, but swap their placement so that:
- the alert marker is on the LEFT zone
- the okay / no-alert marker is on the RIGHT zone

Important:
Do NOT redesign the map.
Do NOT change the number of markers.
Do NOT change the parcel shapes.
Only move the marker positions / assignments.

Files to inspect:
- `src/components/FarmVisualCard.jsx`
- `src/components/components.css`
- `src/pages/DashboardPage.jsx` (only if marker assignment logic is tied to zone ids)

What to change:
1. In the marker definitions inside `FarmVisualCard.jsx`, move the single warning/alert marker to a left-side parcel/position.
2. Move the single verified/okay marker to a right-side parcel/position.
3. If markers are linked to tile ids, make sure:
   - warning uses a left tile
   - verified uses a right tile
4. Keep the warning marker clickable.
5. Keep the verified marker non-clickable.
6. Keep all existing animations/styles unless a small position tweak is needed.

Verification:
- Build the app
- Confirm the alert marker is visually on the left
- Confirm the okay marker is visually on the right
- Confirm click behavior still works

Deliver back:
1. files changed
2. exact marker/tile positions used
3. short summary