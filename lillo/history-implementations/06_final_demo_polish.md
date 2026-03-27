# Challenge 1 UI — Final Demo Polish

You are working on the existing Challenge 1 frontend.

The app already has:
- app skeleton
- phone/desktop preview modes
- farm type selection
- alerts panel
- alert detail page
- shared data model and linking logic

Important:
There is NO longer a separate Config / Integrations page in scope.
Do not reintroduce it.
The concept of “where does this data come from” should instead live inside the Alert Detail experience.

## Goal
Do the final polish pass so the prototype feels coherent, visually strong, and demo-ready.

Do NOT rebuild the app.
Do NOT add backend work.
Do NOT add a fake integrations management page.

This task is about tightening the product story and improving presentation quality.

## Main outcome
The prototype should feel like a focused agriculture alert product with one clear flow:

1. choose farm type
2. see relevant alerts
3. open an alert
4. understand:
   - what is happening
   - why it was triggered
   - where the data comes from
   - what to do next

## What to improve

### 1. Remove old/out-of-scope pieces
- Remove or hide any leftover Config / Integrations route, nav item, page, or placeholder
- Remove UI that suggests a separate integrations management area unless absolutely needed for internal structure
- Keep the product focused on the alert workflow

### 2. Strengthen the full demo flow
Make the sequence feel intentional:
- Farm Type selection should clearly influence the Alerts Panel
- Alerts Panel should clearly lead into Alert Detail
- Alert Detail should feel like the payoff screen

Check for weak transitions, unclear navigation, or leftover placeholder behavior.

### 3. Make “where does this data come from” explicit inside Alert Detail
Inside the alert detail page, improve or add a clear section for source provenance.

This section should answer:
- which sources contributed to this alert
- what each source contributed
- why the system considers this alert relevant

Examples of sources:
- weather data
- field sensors
- satellite observations
- field history / management records

Show this as part of the alert explanation, not as a separate admin page.

Good output format could be:
- source card/list
- signal + interpretation
- small provenance/timeline block

The point is credibility, not technical complexity.

### 4. Final visual polish
Do a last pass on:
- spacing
- typography hierarchy
- consistency of badges and labels
- card quality
- hover/selected states
- transitions and micro-interactions
- visual consistency between phone and desktop preview

Keep it polished, but do not bloat the UI.

### 5. Improve demo readability
Make sure every main screen is understandable quickly.

Farm Type:
- obvious choice
- visually appealing
- little friction

Alerts Panel:
- clear priorities
- clean filtering/state handling
- strong click affordance

Alert Detail:
- strongest screen
- trustworthy explanation
- source transparency
- practical suggested action

### 6. Clean leftover prototype rough edges
Look for and fix:
- inconsistent terminology
- repeated placeholder copy
- awkward spacing
- broken responsive behavior
- weak empty/fallback states
- visual elements that do not match the rest of the product
- anything that still feels like scaffolding instead of a demo

## Optional nice additions
Only if quick and clean:
- subtle transition between Alerts Panel and Alert Detail
- stronger selected-state memory when going back from detail
- a compact “source confidence” or “based on 3 signals” indicator
- a tiny contextual subtitle that changes with farm type

Do not add these if they create noise.

## Constraints
- no separate Config / Integrations page
- no backend
- no real API work unless already trivial
- no major architecture rewrite
- do not break the phone frame mode
- do not create two different products for phone and desktop

## Files likely involved
You may update:
- navigation/app shell
- alerts page
- alert detail page
- shared UI components
- small helpers
- mock data only if needed for provenance clarity

You may remove:
- config/integrations route
- related nav items
- obsolete components

## Success criteria
At the end, the prototype should feel focused and demoable.

A viewer should understand:
- the product adapts to farm type
- alerts are prioritized
- alert detail explains the logic
- the system shows where the data came from
- the prototype is polished enough for a hackathon presentation

## At the end, briefly report
1. what out-of-scope pieces were removed
2. how the end-to-end flow was improved
3. how “where does this data come from” is now shown inside Alert Detail
4. what final polish changes most improved the demo