# Pages Map

Status: `DRAFT` because the dashboard/alert/admin route composition is in place, but visual QA still relies on manual checks.

Files
- `README.md` (`STABLE`) - folder map for route-level screens and behavior notes.
- `adminAccess.jsx` (`STABLE`) - admin-route-only support module that owns the temporary document overflow override used by standalone admin pages.
- `AdminPage.jsx` (`DRAFT`) - standalone `/admin` azienda console kept outside the farmer `AppShell`; it owns memoized search/filter/sort controls and card navigation into customer detail.
- `AdminCustomerPage.jsx` (`DRAFT`) - standalone `/admin/customers/:customerId` customer detail view that derives active summary counts from non-resolved customer alerts, adapts admin alert records into the shared alert-detail structure, and renders each customer alert as a collapsed-by-default expandable card.
- `DashboardPage.jsx` (`DRAFT`) - home route that now embeds the same `Giorgio's farm` profile block with floating critical/medium summary chips in the open bottom-left slot, then shows the enlarged white-theme simulated chatbot recap addressed directly to Giorgio instead of the raw farm-type label.
- `AlertsPage.jsx` (`DRAFT`) - ranked alerts feed with URL-backed filters, a flatter filter strip, and click-to-select behavior for the dedicated alert detail route.
- `AlertDetailPage.jsx` (`DRAFT`) - dedicated `/alert` detail destination that renders the app-selected alert or a quiet empty state when nothing is selected, now routing only the vineyard `humidity-spike` Peronospora case to a dedicated diagnosis-flow layout while keeping all other alerts on the shared `AlertDetailBlock`.
- `FarmTypePage.jsx` (`FROZEN`) - previous profile-selection screen kept as legacy reference; no longer in active routing and now legacy-redirects to the dashboard.
- `pages.css` (`DRAFT`) - page-level layout and route-specific styling for the active page modules above, including the dashboard priority-grid treatment, assistant seed chat styling, and profile composition.

Why these live together
- These files own route-level screens, not reusable primitives.
- The imported admin surface stays in this folder because it is route-level UI.
- Shared page CSS keeps route-specific layout rules, including the admin surface, separate from shell and component-level styles.

Non-obvious behavior
- `AdminPage` and `AdminCustomerPage` are intentionally routed outside `AppShell`, so the farmer phone shell and bottom navigation never render on `/admin`.
- Admin routes temporarily add an `admin-route` class to `html`, `body`, and `#root`, so the document can scroll normally while the farmer preview shell keeps global overflow locked.
- The imported admin routes open immediately with no local auth check or passcode UI; they only keep the standalone admin document-scroll override.
- `AdminCustomerPage` intentionally normalizes incomplete admin alert fields (`fieldName`, relative times, missing `sources`, missing integrated copy) into the shared alert-detail shape so the donor admin detail stays visually aligned with the farmer template without rendering any action block.
- Admin customer alerts are intentionally collapsed by default and expand per-card with a local button state, while the farmer `/alert` detail route keeps its always-open hero plus nested `Integrated` accordion behavior.
- The shell-level `Admin page` button is only an entry shortcut; once on admin routes, navigation stays inside the standalone admin header actions instead of the farmer preview shell.
- `AlertsPage` ranking uses weighted urgency: severity, farm relevance, status urgency, then recency as tie influence.
- Alert filters are URL-backed (`severity`, `source`, `history`) so list context survives navigation.
- The filter strip intentionally avoids top labels and per-view totals, exposing only minimal controls (including a `history` toggle).
- The alert filter strip is sticky and full-bleed at the top of the scrollable page area, so controls remain visible and visually detached from card-width constraints.
- The `history` toggle switches the feed to history-only mode (resolved alerts plus a local archived demo card) and hides current action/monitor alerts until toggled off.
- `AlertsPage` keeps top-priority and non-critical alerts directly in-feed (without titled wrappers); alert opens now route through `/alerts/:alertId` first so the app can hydrate selected-alert state before redirecting to the dedicated `/alert` page.
- `AlertDetailPage` reads only that selected-alert state and intentionally shows a quiet empty placeholder if nothing is selected yet.
- `AlertDetailPage` now uses the shared `AlertDetailBlock`: the title sits inside a severity-tinted hero, the timestamp stays in the top-right metadata row, the field line stays inline under the summary, the existing blue `New notification` cue is preserved through a top-badge slot, and `Integrated` is now the only collapsible roadmap section while still keeping the follow-up relevance note under it.
- `AlertDetailPage` now checks a local diagnosis preset map first; only the vineyard Peronospora case switches to the Italian diagnosis-flow card (`Segnali rilevati -> Problema identificato -> Cosa fare adesso`) with risk-window wording and no confirmed-diagnosis phrasing, while all other alerts keep the existing generic detail rendering path. The Peronospora action section now keeps the closing urgency note in the same container, uses a desktop timeline pattern (numbered bubbles connected by one visible line with staggered reveal), and swaps to a compact stacked action list on mobile.
- `DashboardPage` derives water and soil summary card values from the active alert set (`primary` relevance count and active field list) to stay lightweight without introducing a new data layer.
- `DashboardPage` intentionally removes old context copy/metadata blocks (`farm profile`, `plots tracked`, long intro description) and assistant placeholder headings so the top area focuses on the embedded farm profile, floating alert labels, and chat recap.
- `DashboardPage` now owns the exact shared `Giorgio's farm` profile block, and injects dashboard-only critical/medium summary chips into the unused lower-left corner instead of rendering a separate alert-summary card.
- `DashboardPage` now renders only compact `critical` and `medium` labels inside that floating stage summary and intentionally drops the total-alert headline there.
- `DashboardPage` temporarily maps the two red warning markers in the farm tiles to the first ranked alerts for the current farm so the dashboard can already open `/alert` before true tile-to-alert ownership is modeled.
- `DashboardPage` also injects a temporary per-tile terrain-treatment preview: `tile-4` now keeps the saved warm relief texture, `tile-2` stays on the frozen problem treatment, and `tile-1/3` intentionally fall back to the default plain green parcel fill; only the two warning tiles use the stronger problem tone and remain clickable alert owners.
- `DashboardPage` starts a deterministic assistant recap stream automatically on page enter (without a user seed message), now using Italian recap/callback copy addressed to `Giorgio` while keeping the same follow-up input flow.
- `DashboardPage` assistant card is intentionally split into a clearer header, conversation surface, and composer so the module reads as a standalone dashboard workspace instead of a flat white box.
- In desktop preview, the dashboard assistant container now enters as a square footprint (`340px` width vs `340px` min-height) and expands to full width while adding extra vertical breathing space around the block; this animation is stage-aware, runs at a slower pace, and is intentionally one-shot (only the first time the shell enters Desktop mode).
- `DashboardPage` is mode-aware through CSS shell classes: in `phone` preview, alerts render first, assistant replies stretch to the full chat width for denser reading, and extra alert subtitle copy stays hidden while preserving count/chip visibility.
- `DashboardPage` stacks water/moisture summary cards on separate rows in `phone` preview and hides those cards' subtitle descriptions to reduce clutter.
- `DashboardPage` keeps rounded cards in desktop preview, while `phone` preview uses full-bleed card blocks (edge-to-edge width) with square corners.
- The dedicated `/profile` route was removed; stale `/profile` and `/farm-type` links now redirect to `/dashboard`, which already contains the farm profile block.
