# Components Map

Status: `DRAFT` because core primitives are stable, but profile visual cards were added and still need visual QA across phone and desktop preview modes.

Files
- `README.md` - folder map for reusable UI pieces.
- `IntroTerminal.jsx` (`DRAFT`) - scripted Bash-style simulation window that now runs `visible -> sources -> feeding -> running -> collapsing -> bubble -> connectingToPhone -> handoffToPhone`, including the shared source-icon strip, pre-run connector timing, and the bubble-to-phone callback, while measuring its rendered width and computing `terminalLeft = (phoneLeft / 2) - (terminalWidth / 2)` from the shell-provided phone bounds.
- `IntroTerminal.css` (`DRAFT`) - cinematic terminal window styling, slightly wider Bash-window proportions, simplified source icon surfaces, gray connector animation, a softer two-step morph from window -> larger bubble -> final bubble, the bubble-to-phone handoff line, and final node visuals for the pre-intro simulation panel.
- `PhoneFrame.jsx` - reusable visual device shell that wraps arbitrary app content, keeps the phone asleep while the shell-level intro is active, forwards its root ref for shell-level measurement, and still owns the vibration/lock-screen startup sequence once the intro explicitly hands off to it.
- `PhoneFrame.css` - premium bezel, notch, reflection, startup vibration, and lock-screen styling for the phone frame.
- `SourceIcon.jsx` (`STABLE`) - shared source-symbol SVG set (`sensor`, `weather`, `satellite`) reused by Profile and the intro overlay so those surfaces tell the same integration story.
- `PageHeader.jsx` - consistent title block used by route screens.
- `SectionCard.jsx` - shared card wrapper for grouped page content.
- `StatusBadge.jsx` - tone-aware pill for severities, statuses, and metadata tags.
- `AlertListItem.jsx` - reusable prioritized alert card with compact severity/time metadata, larger right-side signal/problem icons, and card-level open behavior that preserves list return context and focus id.
- `AlertDetailBlock.jsx` (`DRAFT`) - shared alert-detail body for the farmer `/alert` route that owns the severity-tinted hero, collapsible `Integrated` section, and roadmap body while keeping compatibility fallbacks for the current alert shape (`integratedSummary ?? whyTriggered`, optional risk line, and field plot-code rendering).
- `AlertDiagnosisFlow.jsx` (`DRAFT`) - diagnosis-flow detail renderer used for disease-risk style alerts; it owns the compact two-column hero (plant visual + trigger evidence), detected-pattern narrative, data-used matrix, action checklist, and final urgency note from a profile object so new presets (for example Freeze Risk) can be added without changing layout structure.
- `FarmProfileStage.jsx` (`DRAFT`) - shared farm-profile stage that can render the handwritten-style `Giorgio's farm` header plus the static parcel scene, profile integration badges, an optional dashboard-only floating alert summary for the dashboard's top block, and optional tile-alert click wiring passed down from the dashboard route.
- `WaterLevelCard.jsx` (`DRAFT`) - reusable calm trend card with a smooth SVG line and day-axis labels for dashboard summary context.
- `SoilMoistureCard.jsx` (`DRAFT`) - reusable three-pillar moisture card with full-capacity wells and filled level bars for compact dashboard overview.
- `FarmVisualCard.jsx` (`DRAFT`) - reusable static mini-farm scene card with flatter pseudo-isometric parcels, optional terrain-problem overlays inside each tile, an optional floating alert-summary stack, optional tile-level alert buttons over the warning markers, and optional context pills/legend.
- `components.css` - shared styling rules for the reusable components above.

Why these live together
- Each file in this folder is reusable across multiple routes.
- `IntroTerminal` and `PhoneFrame` are both presentation primitives that the shell composes into the pitch intro, while the other components keep page markup lean and consistent.

Non-obvious behavior
- `IntroTerminal` is fully deterministic: it first settles the source icons, then runs the connector-line feed, then starts the fixed log script, reports when the run should enter the collapse phase, pauses briefly on the bubble, and finally fires a bubble-to-phone handoff callback exactly when the phone connector finishes.
- `IntroTerminal` now uses a softer two-step collapse: the wide terminal first eases into a larger round node during `collapsing`, then settles into the smaller stable bubble before the phone handoff begins.
- `IntroTerminal` uses a single mounted root for both the source-feed overlay and the terminal body, and it observes that root's rendered width so the visible Bash window stays centered in the exact gap between the stage left edge and the phone left edge while the phone connector still originates from the same anchor.
- `PhoneFrame` keeps the real routed app mounted underneath the intro overlay so the unlock animation can slide the fake lock screen away instead of remounting the app.
- When the startup intro is enabled, `PhoneFrame` stays visually asleep while the shell-level intro runs, and only transitions from `off` to `vibrating` after the terminal overlay explicitly hands off control.
- `PhoneFrame` only reports intro completion after the state machine reaches its final `app` state, which keeps replay/skip handling deterministic in the preview shell.
- `FarmProfileStage` centralizes the optional profile header, alert-derived field markers, integration-derived source badges, and the optional dashboard-only alert summary so the dashboard keeps one farm-scene owner even after the dedicated Profile route was removed.
- `AlertDetailBlock` resets the `Integrated` accordion whenever the selected alert changes, derives the main integrated copy from `integratedSummary ?? whyTriggered`, and still renders the existing `relevanceReason` as follow-up detail so the `lillo` alert page keeps its current explanation depth while adopting the shared structure.
- `AlertDiagnosisFlow` stays intentionally risk-oriented in wording (`Possible ... onset`, `... risk`, infection window language) and avoids confirmed-diagnosis phrasing while still surfacing actionable field steps.
- `SectionCard` accepts an optional `className` so pages can keep shared card semantics while overriding container tone for special layouts.
- `WaterLevelCard` rescales chart Y positions from provided values so the curve remains readable without introducing dashboard-like chart complexity.
- `SoilMoistureCard` expects percentage-like values and clamps to `0-100` before rendering bar fills.
- `FarmVisualCard` can render an optional floating signal badge row, an optional bottom-left alert-summary stack, fixed tile-status markers (2 verified, 2 warning) with slow up/down animation for pitch readability, and optional per-tile terrain treatments (currently demoed as one saved warm relief texture on a reference tile plus three distinct frozen low-relief repeat patterns on the other parcels, each with a light snowfall overlay and stronger tone on problem tiles); callers still pass temporary warning-tile alert assignments by tile id, while the component owns tile positions, terrain overlay rendering, and button wiring, and it can hide the legend for cleaner profile composition.
- `AlertListItem` picks one source icon from available alert source ids (satellite first when present) and one problem icon from known alert ids, with keyword fallback for unknown templates while keeping the full card as the open-detail affordance; when rendered as historical, it switches to a muted non-link card.
