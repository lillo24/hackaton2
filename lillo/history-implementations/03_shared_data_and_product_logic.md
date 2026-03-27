# Challenge 1 UI — Shared Data Model and Product Logic

You are working on the existing Challenge 1 frontend.
The app skeleton, phone frame, routes, and some mock data/pages already exist.

## Goal
Do NOT rebuild the app.
Do NOT redesign the pages from scratch.

Instead, consolidate and improve the current implementation by:
1. defining a clean shared data model
2. normalizing the mock data
3. strengthening the linking logic between Farm Type, Alerts, Alert Detail, and Integrations
4. making the current app feel more coherent and product-like

## Important constraint
This is a refactor + extension of the current codebase, not a fresh implementation.

Keep what already works.
Only improve structure and logic where useful.

## What should be standardized
Define and consistently use shared structures for these entities:

- `farmType`
- `alert`
- `alertSource`
- `integration`
- `field`

If types/interfaces already partially exist, clean them up rather than duplicating them.

## Main product rules to implement

### 1. Farm Type affects the app
The selected farm type should influence:
- which alerts are shown
- wording of alerts
- relevance/prioritization of alerts
- recommended actions where appropriate
- which integrations/sources appear more relevant

Example:
- Vineyard should emphasize disease, humidity, leaf wetness, frost, irrigation stress
- Orchard should emphasize frost, disease pressure, temperature swings, water stress
- Greenhouse should emphasize controlled-environment anomalies
- Open Field should emphasize weather exposure, rainfall, soil, irrigation

This does not need advanced logic.
Simple, believable mock logic is enough.

### 2. Alerts Panel links correctly to Alert Detail
When an alert is clicked:
- open the correct Alert Detail page
- preserve the selected alert context
- show all relevant data for that alert from the shared model

### 3. Alert Detail should be data-driven
The Alert Detail page should render from the alert object and related entities, not from hardcoded page copy.

Each alert should support fields such as:
- id
- title
- severity
- status
- farmType relevance
- source ids
- field/plot reference
- short summary
- why triggered
- suggested action
- timestamp / recency
- timeline/history items
- related integration ids

Not every field must be deeply complex, but the structure should be clean.

### 4. Integrations should connect to alert sources
The Config / Integrations page should not feel isolated.
Each integration should clearly map to one or more alert sources.

Examples:
- Weather API -> rainfall, temperature, humidity, wind
- IoT Sensors -> soil moisture, leaf wetness, local temperature
- Satellite -> vegetation stress, parcel observation
- Farm Management System -> treatment history, crop/field context

At least at mock-data level, alerts should be explainable through these sources.

## What to improve in the UI behavior
Without redesigning the whole UI, add coherence through:
- better alert filtering
- better status labeling
- better source labeling
- clearer severity handling
- realistic timestamps / recent activity
- consistent field naming
- consistent terminology across pages

## Add these missing UX states if not already present
- empty state for alerts
- empty state for integrations
- loading/skeleton state if easy to add
- fallback state when an alert id is missing or invalid

Keep them lightweight and demo-friendly.

## Suggested implementation direction
- Centralize mock data in a cleaner structure
- Add shared helpers/selectors if useful
- Prefer derived views over duplicated hardcoded arrays
- Keep logic simple and readable
- Avoid overengineering state management

## Files likely involved
You may update:
- mock data files
- shared types/models
- helpers/selectors
- Alerts page
- Alert Detail page
- Farm Type page/section
- Config / Integrations page

But:
- do not rewrite the visual system
- do not replace the PhoneFrame / preview system
- do not rebuild routing unless necessary

## Output goals
At the end, the app should feel like one coherent product where:
- farm type selection matters
- alerts are structured consistently
- alert detail is meaningfully connected to the alert list
- integrations clearly explain where alert signals come from

## At the end, briefly report
1. what shared models were introduced or cleaned up
2. what linking logic was added
3. what existing code was reused
4. what UX empty/loading/fallback states were added