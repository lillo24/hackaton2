# Challenge 1 UI — Alerts Panel Polish

You are working on the existing Challenge 1 frontend.

The app already has:
- app skeleton
- page routing
- phone/desktop preview modes
- farm type selection
- alerts page
- alert detail page
- config/integrations page
- shared mock data and product linking logic

## Goal
Improve the **Alerts Panel** so it feels like the operational core of the product.

Do NOT rebuild the app.
Do NOT redesign everything from scratch.
Do NOT change the product structure.

This task is about making the Alerts Panel more useful, readable, and demo-ready.

## Main outcome
The Alerts Panel should feel like:
- the first place a farmer or technician looks
- a prioritized operational feed
- a clear bridge between raw signals and action

## What to improve

### 1. Prioritization
Make the alert list feel ordered and meaningful.

Use believable prioritization based on:
- severity
- recency
- relevance to selected farm type
- status

High severity and highly relevant alerts should feel more prominent.

### 2. Filtering
Add lightweight filtering that improves demo clarity.

Good filters:
- severity
- status
- source
- farm relevance if useful

Keep filters simple.
Do not build a heavy enterprise filter system.

### 3. Visual hierarchy
Improve how each alert card/list item reads at a glance.

Each alert item should clearly show:
- title
- severity
- short explanation
- source(s)
- timestamp / recency
- field/plot name if available
- status
- quick action cue or “view details”

The user should understand the alert in a few seconds.

### 4. Richer alert states
Make alert status more believable.

Examples:
- new
- active
- monitoring
- acknowledged
- resolved

If some already exist, standardize and improve presentation.

### 5. Better empty and fallback states
Add or improve:
- no alerts for current filters
- no high-priority alerts
- missing data fallback
- loading/skeleton state if easy

These should still feel polished and on-brand.

### 6. Stronger navigation to detail
The connection to Alert Detail should feel intentional.

Improve:
- click affordance
- selected/hover states
- “view details” clarity
- preservation of context when navigating

## UX direction
The Alerts Panel should feel:
- premium
- readable
- slightly dynamic
- not overloaded
- not like a boring admin table

Prefer:
- polished cards or hybrid list/cards
- good spacing
- severity badges
- subtle motion
- clean grouping

Avoid:
- giant dense tables
- too many tiny controls
- visual clutter
- fake complexity

## Optional nice additions
Only if quick and clean:
- group alerts into sections like:
  - Needs action now
  - Monitor
  - Recently resolved
- add a small summary strip like:
  - 2 critical
  - 4 active
  - 3 monitoring
- add subtle staggered appearance or hover lift

These are optional.
Only keep them if they improve clarity.

## Constraints
- reuse existing shared data model
- reuse current pages and routing
- do not rewrite mock data unnecessarily
- do not redesign the whole app shell
- do not break phone view
- do not make desktop and phone behave like two separate products

## Files likely involved
You may update:
- Alerts page
- alert list/card components
- shared badges/status components
- small helper utilities
- small layout/styling helpers

You may also make minimal changes to:
- routing/navigation affordances
- shared page headers
- preview layout only if needed for readability

## Success criteria
The Alerts Panel should:
- immediately communicate what matters most
- look polished in both phone and desktop preview
- clearly reflect farm-type-aware logic
- make the user want to click into Alert Detail

## At the end, briefly report
1. what was improved in alert prioritization
2. what filters/states were added or refined
3. what components were reused vs updated
4. whether anything was adjusted for phone vs desktop readability