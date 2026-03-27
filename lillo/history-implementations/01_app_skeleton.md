# Challenge 1 UI — App Skeleton

Build the initial frontend skeleton for a small MVP for an agriculture alert platform.

## Goal
Create the base app structure only.
Do not build the full business logic yet.
Focus on navigation, layout, routes, and a clean foundation for the next pages.

## Pages to include
Create these 3 pages/routes:

1. **Farm Type**
   - A section/page where the user can choose their farm type
   - Think of it like a “character build” selection
   - This will later influence which alerts and information are shown

2. **Alerts Panel**
   - Page with the list of alerts
   - For now, only the layout + placeholder list/cards/table is needed

3. **Alert Detail**
   - Separate page opened from an alert in the Alerts Panel
   - For now, use mock navigation and mock content

4. **Config / Integration**
   - Page showing available integrations / APIs / data sources
   - For now, simple cards/list with connection status placeholders

## Main request
Implement the **app shell**:
- sidebar or left navigation
- top bar/header
- page container
- responsive layout
- simple visual theme coherent with agriculture / monitoring / alerts
- routing between pages

## Requirements
- Use clean, modular components
- Use mock data only
- Keep the design simple, modern, and hackathon-friendly
- No dashboard for now
- No backend needed
- No real API calls needed
- No authentication needed unless already required by the stack

## Suggested navigation
- Farm Type
- Alerts
- Config / Integrations

Alert Detail should be reachable by clicking an alert from the Alerts page.

## Suggested components
Create reusable base components where useful:
- AppLayout
- Sidebar
- Topbar
- PageHeader
- Card
- StatusBadge
- AlertListItem (basic placeholder)
- IntegrationCard (basic placeholder)

## Farm Type page behavior
- Show selectable farm type cards
- Example farm types:
  - Vineyard
  - Orchard
  - Open Field
  - Greenhouse
- Allow one selected state
- Save selection in simple frontend state for now
- This state does not need full logic yet, but should be ready to be used later

## Alerts page behavior
- Show a mock list of alerts
- Each alert should have at least:
  - title
  - severity
  - source
  - short description
- Clicking one alert opens Alert Detail page

## Alert Detail page behavior
Show placeholder sections:
- alert summary
- why it triggered
- sources involved
- suggested action
- history / timeline placeholder

## Config / Integration page behavior
Show mock integrations such as:
- Weather API
- IoT Sensors
- Satellite Data
- Farm Management System

Each integration card can show:
- name
- status
- last sync
- available data types

## Styling direction
- modern UI
- not too corporate
- agriculture + operational monitoring feeling
- soft natural palette, but still clear for alert severity
- good spacing and readable hierarchy

## Output
Return:
1. the implemented app structure
2. the created routes/pages/components
3. short notes on how the project is organized

## Important
Do not overengineer.
This is just the foundation for later implementation chapters.
Keep the code easy to extend.