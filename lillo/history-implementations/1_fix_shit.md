Make two small behavior changes in the existing Vite + React app.

Goal 1:
The admin login gate should let me enter with any password instead of checking for the fixed demo passcode.

Goal 2:
The "Back to dashboard" button on the admin page should open the app in Roadmap mode instead of the normal dashboard view.

Important context:
Right now Roadmap is NOT a route page. It is a preview mode inside `AppShell` (`previewMode === 'roadmap'`), so just changing the button `to="/dashboard"` is not enough.
You need to make roadmap openable through the URL, for example with a search param like:
`/dashboard?mode=roadmap`

Files to inspect:
- `src/pages/adminAccess.jsx`
- `src/pages/AdminPage.jsx`
- `src/pages/AdminCustomerPage.jsx`
- `src/layout/AppShell.jsx`
- `src/App.jsx`

What to change:

1. Admin access: allow any password
- In both admin gate submit handlers (`AdminPage.jsx` and `AdminCustomerPage.jsx`), remove the strict check against `ADMIN_PASSCODE`.
- On submit, always set:
  - `window.sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true')`
  - `setHasAccess(true)`
  - clear `passcode`
  - clear `errorMessage`
- Do not block entry anymore.
- Also update the gate copy in `adminAccess.jsx` so it no longer tells the user to enter a specific demo passcode.
- Keep the password field as-is visually unless a tiny text tweak is needed.

2. Make roadmap selectable from URL
- In `AppShell.jsx`, read the current URL search params.
- Support:
  - `?mode=roadmap`
  - optional: `?mode=phone`
  - optional: `?mode=desktop`
- Initialize `previewMode` from the query param when present.
- Also sync it when the route/search changes, so navigating to `/dashboard?mode=roadmap` actually switches the shell into roadmap mode.
- Keep the current toggle buttons working.
- When a user clicks one of the preview mode buttons, also update the URL search param so the state is reflected in the URL.
- Do this with the smallest clean React Router solution (`useSearchParams` is fine).

3. Change the admin button target
- In `src/pages/AdminPage.jsx`, change the current:
  - `to="/dashboard"`
  to
  - `to="/dashboard?mode=roadmap"`
- Also rename the visible text from:
  - `Back to dashboard`
  to
  - `Back to roadmap`
  so the label matches the actual behavior.

4. Do not break existing behavior
- Admin routes should still bypass the shell as they do now.
- Regular `/dashboard` with no search param should still default to the current normal mode.
- The intro/startup logic should still behave the same on normal dashboard mode.
- Roadmap mode should still render the existing `RoadmapPresentation` component.

5. Verify
- Run a build.
- Confirm:
  - admin gate accepts any typed password
  - `/dashboard?mode=roadmap` opens roadmap mode
  - the admin button now lands there
  - mode toggle still works

Deliver back:
1. files changed
2. short explanation
3. any edge case or limitation noticed