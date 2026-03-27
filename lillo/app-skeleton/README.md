# App Skeleton Map

Status: `DRAFT` because the visual MVP is implemented, but it still needs dependency installation and automated test coverage.

Files and folders
- `README.md` - folder map for this runnable app package.
- `package.json` - project manifest for the standalone Vite React app.
- `package-lock.json` - npm lockfile captured after dependency installation for reproducible installs.
- `vite.config.js` - Vite configuration for the React build.
- `index.html` - browser entry document for the app.
- `src/` - application code, mock data, page modules, layout, and reusable components.

Why these live together
- This folder is the runnable implementation for the `01_app_skeleton.md` and `prompt_extract_phone_frame.txt` briefs.
- The app stays isolated under `lillo/` so the donor repo remains a read-only reference.

Non-obvious behavior
- The app loads with a fixed `Vineyard` profile context (simulating externally fetched profile data) and no profile-selection route in the main navigation.
- The home route redirects to `/dashboard`, which is intentionally an empty placeholder for the future daily farmer dashboard.
- The dedicated `/alert` route renders from app-level selected-alert state and shows a quiet empty state when opened without selecting an alert first.
- The imported admin console now lives locally inside `lillo/app-skeleton` on `/admin` and `/admin/customers/:customerId`; it stays independent from the farmer preview shell even though the shell top bar now exposes an `Admin page` entry button.
- The `PhoneFrame` is the primary preview container; the desktop text column is supporting presentation context only.
