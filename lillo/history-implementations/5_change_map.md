In the lillo/app-skeleton repo, update the customer dashboard map styling.

Goal:
- In the dashboard farm map, move the current background/treatment of the TOP tile to the LEFT tile.
- Then make the TOP tile and the BOTTOM tile plain green, with no special texture/pattern/ice/fungus overlay.
- Keep the RIGHT tile as it is now.

Context:
- The map tiles are defined in:
  - src/components/FarmVisualCard.jsx
  - src/pages/DashboardPage.jsx
- The terrain styles are currently assigned in buildDashboardTileTerrainTreatments() inside DashboardPage.jsx.
- Tile ids are:
  - tile-1 = top
  - tile-2 = right
  - tile-3 = bottom
  - tile-4 = left

What to change:
1. In buildDashboardTileTerrainTreatments(), make tile-4 use the same treatment that tile-1 currently has.
2. Remove any special terrain treatment from tile-1 and tile-3 so they render as the default plain green map tiles.
3. Do not change tile-2.
4. Keep the alert click behavior and marker logic unchanged.
5. Do not redesign anything else.

Expected final visual:
- Left tile: uses the old top-tile background.
- Top tile: plain green.
- Bottom tile: plain green.
- Right tile: unchanged.

After editing, verify the dashboard still builds and that only the map backgrounds changed.