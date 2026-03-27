# Challenge 1 UI — Alert Detail Page

You are working on the existing Challenge 1 frontend.

## Goal
Create a real **Alert Detail** page and clearly separate it from the **Alerts List** page.

Right now the product needs a stronger flow:

1. user sees the list of alerts
2. user selects one alert
3. user opens a dedicated detail page
4. user understands:
   - which data are used
   - how they combine
   - what problem is being inferred
   - what action the farmer should take

Do NOT overcomplicate this page.
Keep it simple, visual, and centered on the core logic.

---

## Main UX idea

The Alert Detail page should be built around this structure:

### 1. Data inputs
Show the main data sources that contributed to the alert.

Example:
- Meteo
- Satellite
- Soil temperature

These should be shown as **3 separate visual blocks/cards**.

### 2. Convergence / integration
These inputs should visually **merge into one explanation**.

For example:
- three lines flowing into one central explanation box
- or three source cards feeding one merged interpretation area

The point is to make the logic visible:

**multiple signals -> one interpreted problem**

### 3. Problem explanation
At the center, show the interpreted issue.

Examples:
- Frost risk increasing overnight
- Water stress likely in sector B
- Disease conditions becoming favorable

This explanation box is the heart of the page.

### 4. Farmer action
Below the explanation, add a downward arrow / connection to the next block:

**Recommended action for the farmer**

Examples:
- Inspect field before 8:00
- Prepare frost protection
- Check irrigation schedule
- Monitor affected block in next 12h

The visual logic should be:

**data sources -> explanation of the problem -> action to take**

---

## Important constraints
- Do NOT make this page too dense
- Do NOT add many secondary widgets
- Do NOT turn it into a technical dashboard
- Do NOT create fake complexity

Keep only the core components needed to tell the story.

---

## Required page structure

### Top area
Keep a very small header with:
- alert title
- severity
- field/plot name
- timestamp or recency

This should be light and compact.
Do not let it dominate the page.

### Main detail area
Build the page mainly around these sections:

#### A. Source data blocks
Three visual blocks/cards for the main sources.
Use realistic examples based on the selected alert.

Each block can show:
- source name
- one key metric or signal
- very short relevance note

Example:
- Meteo -> humidity 91%, temp drop forecast
- Satellite -> vegetation stress anomaly
- Soil sensor -> soil temperature 1.8°C

#### B. Integrated explanation
A central block showing:
- what the system inferred
- why this matters now

This should feel like the output of combining the signals.

#### C. Recommended action
A lower block showing:
- what the farmer should do next
- optionally when to do it
- keep it concrete and short

---

## Visual direction
This page should feel:
- clean
- readable
- visual
- explanatory
- trustworthy

Prefer:
- simple cards
- connecting lines/arrows
- clear hierarchy
- one strong central explanation block
- one clear action block

Avoid:
- long paragraphs
- too many stats
- large tables
- too many filters/buttons
- cluttered side panels

---

## Page relationship with Alerts List
The Alerts List and Alert Detail must be clearly separated.

Requirements:
- Alerts page remains the list view
- clicking an alert opens a dedicated Alert Detail page
- preserve the selected alert context
- preserve back navigation to the alerts list

Do not merge list and detail into one overloaded screen.

---

## Data/content guidance
Use the current mock/shared data model.
If needed, enrich alerts with only the minimum fields required for this page.

Each alert should provide enough data to render:
- title
- severity
- field
- timestamp
- 2 to 4 contributing sources
- explanation
- recommended action

If three sources do not always make sense, allow 2 to 4.
But visually, aim for the simple “3 inputs -> 1 explanation -> 1 action” pattern.

---

## Optional small additions
Only if quick and clean:
- a small “confidence” label
- a small “based on 3 signals” indicator
- subtle motion for source cards and connecting lines
- a compact back button to Alerts

Do not add more than this.

---

## Files likely involved
You may update:
- Alert Detail page
- Alerts page navigation
- shared alert data/model
- small visual helper components for source blocks / explanation / action flow

Do not redesign the whole app shell.

---

## Success criteria
At the end, the Alert Detail page should clearly communicate:

- these are the data sources used
- this is how they combine
- this is the inferred problem
- this is what the farmer should do next

A viewer should understand the page in a few seconds.

---

## At the end, briefly report
1. how Alerts List and Alert Detail are now separated
2. which components were added for the detail flow
3. how the source -> explanation -> action structure was implemented
4. what data fields were needed to support the page