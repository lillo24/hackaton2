Remove the admin login gate entirely from the existing Vite + React app.

Goal:
The admin pages should be directly accessible with no login, no passcode form, no sessionStorage check, and no access gate UI.

Affected routes that must open immediately:
- /admin
- /admin/customers/:customerId

Files to inspect:
- src/pages/AdminPage.jsx
- src/pages/AdminCustomerPage.jsx
- src/pages/adminAccess.jsx
- any constants/hooks related to:
  - ADMIN_ACCESS_KEY
  - ADMIN_PASSCODE
  - hasAccess
  - passcode
  - errorMessage

What to do:

1. Remove the access gate logic from `AdminPage.jsx`
- Delete all admin auth state and submit logic:
  - `hasAccess`
  - `passcode`
  - `errorMessage`
  - any `handleUnlock` / submit handler
  - any sessionStorage reads/writes
  - any `ADMIN_ACCESS_KEY` / `ADMIN_PASSCODE` usage
- Remove the conditional rendering that shows `<AdminAccess ... />`
- Make the page always render the actual admin content directly

2. Remove the access gate logic from `AdminCustomerPage.jsx`
- Do the same cleanup there:
  - remove auth state
  - remove passcode handling
  - remove sessionStorage logic
  - remove conditional gate rendering
- Make the customer detail page always render directly

3. Remove the now-unused access component
- If `src/pages/adminAccess.jsx` becomes unused, delete it
- If deleting it requires import cleanup, remove those imports too

4. Remove dead constants/imports
- Delete unused constants and imports related to admin auth
- Clean up any warnings from unused React hooks or variables

5. Keep everything else working
- Do NOT redesign the admin pages
- Keep existing scrolling/layout behavior
- Keep the “Back to roadmap” behavior if it was already changed
- Do not alter customer data, filters, or alert UI unless required by the auth removal

6. Verify
- Run build
- Confirm:
  - `/admin` opens immediately
  - `/admin/customers/:customerId` opens immediately
  - there is no login UI anywhere
  - there are no unused import/build errors

Deliver back:
1. files changed
2. short summary of what was removed
3. confirmation that no admin auth code remains