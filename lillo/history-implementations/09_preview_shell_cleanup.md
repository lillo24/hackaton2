# Challenge 1 UI — Preview Shell Cleanup

You are working on the existing Challenge 1 frontend.

## Goal
Clean up the overall preview shell and simplify the presentation.

Important:
Do NOT rebuild the app.
Do NOT redesign all pages.
Do NOT change the product flow.
This task is only about the outer layout / preview presentation.

## Main problems to fix
Right now the shell feels too much like a landing page:
- there is side text / intro content next to the preview
- desktop mode does not feel like a real desktop view
- phone mode is not isolated enough

I want a much cleaner setup.

## Required target behavior

### 1. Desktop mode
Desktop mode should be:
- full window
- app content only
- no marketing text on the side
- no extra descriptive panel
- no split hero layout
- no “landing page” feel

The desktop view should feel like the actual product opened in a browser window.

### 2. Phone mode
Phone mode should be:
- the phone frame alone
- centered in the page
- no side text
- no extra info blocks around it
- only the toggle button visible outside the phone

The phone should feel like a focused centered preview object.

### 3. Shared rule for both modes
Outside the app preview, keep only:
- the preview mode toggle

Remove or hide:
- side intro copy
- hero text
- stats blocks
- mission rail
- extra descriptive content around the preview

The preview area should be visually minimal and clean.

## Layout direction

### Desktop mode layout
- Use the full available window width/height
- Render the app as a proper desktop application container
- It can still have max width if needed for polish, but it must read as a desktop app, not as a centered narrow phone-like column
- No side companion content

### Phone mode layout
- Center the phone horizontally
- Keep generous breathing room around it
- The page outside the phone should stay visually quiet
- Only the mode toggle should remain outside the phone

## Implementation guidance
Refactor the shell so that:
- the preview wrapper decides between phone and desktop mode
- the app content is reused
- there is one clean outer shell
- there is no separate left informational column anymore

Likely this means:
- remove the current intro/marketing section from AppShell
- simplify the outer grid/flex layout
- keep only a top control area for the mode toggle
- center the preview area

## Important constraints
- do not rewrite the internal pages again
- do not change mock data
- do not break routing
- do not break current navigation
- do not remove the phone frame
- do not create two different apps for phone and desktop
- one app, two wrappers, clean shell

## Visual direction
The result should feel:
- cleaner
- calmer
- more product-focused
- more demo-ready
- less like a promotional landing page

## Files likely involved
You will probably need to update:
- AppShell.jsx
- AppShell.css
- preview mode wrapper/container if one already exists
- minimal PhoneFrame sizing/alignment styles if needed

Only touch page files if absolutely necessary for width/readability.

## Success criteria
At the end:
- desktop mode is a true full-window product preview
- phone mode is just the centered phone plus the toggle
- no extra side text remains
- the whole UI feels cleaner and more intentional

## At the end, briefly report
1. what outer-shell elements were removed
2. where the toggle now lives
3. how desktop mode is rendered
4. how phone mode is centered and isolated