# Challenge 1 UI — Simplify Profile Page + Move Trend Cards to Dashboard

You are working on the existing Challenge 1 frontend.

Important context:
- The repo was already updated multiple times.
- Do NOT rely on the history-implementation prompts as the single source of truth.
- Work from the current codebase as it is now.

Current product direction:
- This is still an alert-first agricultural app.
- Profile is a secondary read-only page.
- Dashboard is the home page and can now start hosting a small amount of visual summary content.
- The overall concept is still: integrate weather + sensors + satellite into useful prioritized alerts.

## Goal

Refactor the current **Profile** page so it becomes:
- simpler
- less container-heavy
- more emblematic
- slightly game-like in a tasteful way
- more focused on basic farm identity/context

At the same time:
- move the **moisture** and **water level trend** cards out of Profile
- place them in the **Dashboard** instead

## Main requested changes

### 1. Profile page: reduce the “too many rounded containers” feeling
Right now the page feels over-carded / over-containerized.

Simplify it.

What I want:
- fewer nested rounded panels
- cleaner composition
- less “card inside card inside card”
- preserve readability, but make it feel lighter

Do not remove structure completely.
Just reduce the visual noise.

### 2. Farm visual: fix the current indie farm
The current farm visual has the right intention, but the drawing feels wrong:
- it currently reads too much like a geometric parallelepiped
- the extra lines feel weird / artificial
- it looks more like a block with markings than a tiny farm scene

I still want the **indie-farm / mini-game** feeling, but cleaner.

Refactor the farm visual so it feels more like:
- a tiny stylized farm/plot scene
- symbolic and readable
- simple and static
- slightly game-like
- less geometric-boxy
- less “3D block with random lines”

Possible direction:
- flatter isometric or pseudo-isometric farm patch
- simpler parcels / paths / crop rows
- maybe 1–2 tiny emblematic elements like a tree, water tank, marker, path, or field boundary
- make it feel intentional, not decorative noise

Important:
- keep it lightweight
- no libraries
- no real 3D
- no complex illustration system
- do not let it dominate the page

### 3. Move water trend + soil moisture cards to Dashboard
The following visual widgets should no longer be on Profile:
- water level trend
- soil moisture pillars

Move them into the Dashboard page.

Dashboard can now become:
- still mostly simple
- but not totally empty anymore

It should feel like the beginning of a future farmer summary page.

Good structure:
- page header
- a light placeholder / intro block
- then the two existing visual cards:
  - Water level trend
  - Soil moisture

Do not turn Dashboard into a full analytics page.
Just let it host these two summary widgets.

### 4. Connected sources icons: keep only the symbols
In the connected sources section on Profile:
- weather
- satellite
- sensors

Simplify the visual treatment.

What I want:
- keep only the icon/symbol
- remove unnecessary extra visual clutter
- make the icon background green when active
- make it feel like an active stat/status in a game UI

Desired feeling:
- symbolic
- compact
- readable
- “active ability / active stat” energy
- but still clean and not childish

Important:
- green background should communicate active/connected
- icons should remain simple and legible
- avoid red unless truly needed for disconnected/error state
- keep the list elegant, not like a settings panel

### 5. Profile content should focus on emblematic farm identity
The Profile page should show only the most emblematic/basic farm context.

Focus on things like:
- crop type
- soil type
- maybe number of plots / blocks
- maybe irrigation presence / monitoring mode if already easy to support
- other very basic identity/context info only if it helps

This should feel more like:
“what kind of farm profile is this?”
and less like:
“here is a detailed operational dashboard”

Important:
- keep it concise
- game-like in spirit, not literally a game HUD
- think “farm identikit”
- avoid admin/settings overload

## Tone / visual direction

Target feeling:
- agritech
- emblematic
- slightly game-like
- less overdesigned
- still believable for a hackathon demo

Keep:
- green as the main active/status color
- warm/light agricultural palette
- good spacing
- simple hierarchy

Avoid:
- too many rounded boxes
- too many decorative borders
- dense dashboard complexity
- enterprise admin look
- childish game UI
- fake realism

## Scope boundaries

You may update:
- `src/pages/ProfilePage.jsx`
- `src/pages/DashboardPage.jsx`
- `src/components/FarmVisualCard.jsx`
- relevant CSS files
- small shared component styling if useful

You may lightly reshape the Profile layout if needed.

Do NOT:
- change routing
- rebuild app structure
- redesign Alerts flow
- add new heavy dependencies
- create a whole new data architecture
- over-engineer the farm illustration

## Implementation guidance

Use the current components where reasonable, but refactor if needed.

Suggested approach:
1. simplify Profile layout and reduce nested card feeling
2. move the two visual summary cards into Dashboard
3. redesign the farm visual so it no longer looks like a strange block
4. simplify connected source icons into compact green active-status symbols
5. rewrite the basic farm context to focus on emblematic items like crop type and soil type

If some current mock data does not yet expose soil type cleanly, add a minimal mock field only if needed.
Keep it coherent and lightweight.

## Success criteria

At the end:
- Profile feels simpler and cleaner
- Profile has fewer “too many rounded container” vibes
- Farm visual looks more like a tiny stylized farm scene and less like a parallelepiped
- Water trend and soil moisture are on Dashboard
- source icons feel like green active game-like stats
- Profile emphasizes crop type, soil type, and other emblematic farm identity info
- the app still feels alert-first overall

## At the end, briefly report
1. which files you changed
2. how you simplified the Profile composition
3. how you redesigned the farm visual
4. how you moved the trend widgets into Dashboard
5. any small mock data additions you made