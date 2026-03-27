I want to add two preview modes to the current app:

1. **Desktop view**
2. **Phone view** using the existing PhoneFrame

Add a clear **toggle button / segmented control** to switch between the two views.

Requirements:
- Keep the current app pages and logic
- Do NOT rebuild the app structure
- Do NOT change mock data
- Do NOT redesign the full UI
- Only add the preview-mode system and adapt layout where needed

Behavior:
- **Phone mode**: render the app inside the current PhoneFrame
- **Desktop mode**: render the same app content in a desktop container, without the phone shell
- The toggle should switch instantly between the two
- Keep the currently open page when switching
- Keep the currently selected farm type when switching

Design:
- The toggle should feel polished and coherent with the current style
- Put it in a visible but clean place, probably near the preview area header
- Keep the phone mode visually strong
- Desktop mode should feel like a proper web app preview, not just a stretched phone

Implementation guidance:
- Create a small preview mode state, for example: `phone | desktop`
- Reuse the same inner page content for both modes
- Separate:
  - outer preview shell
  - inner app content
- Avoid duplicating page code for phone and desktop

Suggested structure:
- Keep `PhoneFrame` for phone mode
- Add a desktop preview wrapper/container for desktop mode
- Let `AppShell` or the main preview layout decide which wrapper to use
- The page content inside should stay the same component tree as much as possible

Important:
- Do not make desktop mode just a giant scaled-up phone frame
- Do not create two different apps
- One app, two wrappers/views

Responsive/layout notes:
- Desktop view should have more horizontal breathing room
- Phone view should preserve the current frame fidelity
- If a page needs small layout adjustments to look acceptable in both modes, make minimal shared changes only

Files to likely touch:
- AppShell
- PhoneFrame
- preview container/wrapper components
- any small shared layout helper needed

At the end, briefly report:
1. where the preview mode state lives
2. which components decide phone vs desktop rendering
3. whether any page layout needed adjustment for dual-view support