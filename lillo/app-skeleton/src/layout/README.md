# Layout Map

Status: `DRAFT` while preview-shell presentation is still being tuned and has no automated visual regression coverage.

Files
- `README.md` (`STABLE`) - folder map for shell-level files and ownership notes.
- `AppShell.jsx` (`DRAFT`) - owns shell composition, preview-mode state, URL sync for `mode` search params, mode toggle UI, the shell-level `Admin page` entry button, phone-intro replay/skip controls, stage-level click/space trigger for the terminal pre-intro, measurement of the centered phone/stage bounds for overlay positioning, terminal phase transitions through `visible -> sources -> feeding -> running -> collapsing -> bubble -> connectingToPhone -> handoffToPhone`, the intro-to-phone trigger callback, the current three-item primary nav (`Dashboard`, `Alerts`, `Alert`) with icons, and stage wrapper selection (`PhoneFrame`, desktop preview frame, or Roadmap presentation mode).
- `AppShell.css` (`DRAFT`) - styles for the outer shell (toggle + preview stage), including the decoupled phone-anchor layer, measured intro overlay layer, the shared pill styling used by the admin entry link and intro controls, absolute phone centering that never shares layout flow with the intro, the desktop-preview-only side rail layout for desktop nav, and the unclipped stage layering needed for the outgoing bubble-to-phone connector.
- `RoadmapPresentation.jsx` (`DRAFT`) - dedicated presentation-mode canvas rendered only in `Roadmap` mode; owns step state, click/keyboard progression, animated Company -> Consorzio -> many farmers sequence, top-farmer identikit burst, and final visual cost/time overlay step.
- `RoadmapPresentation.css` (`DRAFT`) - full-bleed roadmap canvas styling plus node/line reveal animations, top-farmer focus treatment, identikit burst tokens, floating arrow controls, and compact cost/time panel visuals.

Why these live together
- `AppShell.jsx` owns app-wide presentation structure and preview wrapper decisions.
- `RoadmapPresentation` is a shell-level view, not a route page, so it stays with shell ownership and mode toggling.
- `AppShell.css` and `RoadmapPresentation.css` are tightly coupled to stage behavior and should evolve with their paired components.

Non-obvious behavior
- `AppShell` only auto-queues the phone startup sequence for the initial `/dashboard` entry in phone preview; later route changes do not replay it unless the shell-level `Replay intro` control is used.
- `AppShell` now accepts `?mode=roadmap`, `?mode=desktop`, and `?mode=phone`; invalid or missing `mode` values fall back to the default phone preview, and shell toggle clicks keep that state mirrored in the URL.
- `AppShell` now owns a shell-level terminal phase (`visible -> sources -> feeding -> running -> collapsing -> bubble -> connectingToPhone -> handoffToPhone`) before the phone startup phase, so click/tap on the stage or `Space` starts the source-feed story and the phone wakes only after the outgoing connector reaches it.
- `AppShell` passes the current top-ranked mock alert into `PhoneFrame`, so the fake lock-screen notification stays aligned with the real dashboard alert data.
- The shell top toggle area now includes an `Admin page` link, but that control performs route navigation only; the standalone admin routes still bypass the shell entirely instead of reusing preview-mode state.
- `AppShell` keeps the phone in its own absolute centered layer and measures the rendered `PhoneFrame` bounds inside the stage; `IntroTerminal` then uses `phoneLeft = phoneRect.left - stageRect.left` together with the rendered terminal width to compute `terminalLeft = (phoneLeft / 2) - (terminalWidth / 2)`, plus a dedicated `phoneTrigger` point on the phone's left side from those same bounds, so both the terminal bubble and the outgoing phone connector stay spatially correct without shifting the phone.
- `AppShell` keeps the combined intro pending until `PhoneFrame` reports that its startup state machine has finished, which lets the phone remain asleep during the overlay phases and only reveal the app after the full handoff sequence completes.
- `PreviewApp` writes the current nav item count into a CSS custom property so the bottom phone nav stays evenly spaced even when the nav item list changes.
- In desktop preview, the shell keeps the preview frame pinned between the mode toggle and the viewport bottom by forcing the desktop grid into a single `minmax(0, 1fr)` row; the side rail stays fixed and only `main.mobile-app__content` owns vertical scrolling.
- `PreviewApp` now resets that inner `main.mobile-app__content` scroller to the top whenever the route changes away from `/alerts`, which prevents shorter pages like `/alert` from appearing blank after opening them from deep inside a scrolled alert list while still preserving the alerts-feed scroll position itself.
- `Roadmap` mode intentionally bypasses both phone and desktop app wrappers: routed `Outlet` content is not rendered in that mode.
- `RoadmapPresentation` advances by stage click/tap, keyboard (`ArrowLeft`, `ArrowRight`, `Enter`, `Space`), or floating arrow controls; all reveal logic is driven by a local step state.
- `RoadmapPresentation` measures the rendered positions of Company, Consorzio, and farmer nodes to draw connector paths, so the network stays aligned after resize and in full-screen desktop presentation mode.
- After the network distribution step, `RoadmapPresentation` automatically runs two farmer identikit bursts in sequence (top farmer, then third farmer), and the next click shifts the network upward into a featured-farmer example stage before the cost overlay step.
- In `Roadmap` mode, the shell switches to a single full-bleed stage with no outer container; the preview-mode toggle becomes fixed/overlayed at the top-left and does not consume layout space.
- Final roadmap step overlays a compact visual estimate panel (`time + cost`) inside the same canvas, while dimming the network layer to keep focus on costs.
- The shell applies a route-aware scroll-container variant so `/alerts` hides the vertical scrollbar track while preserving scroll interaction.
