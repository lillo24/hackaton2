# Data Map

Status: `DRAFT` because the structures now model shared entities consistently, but they are still mock records and may shift with real API contracts.

Files
- `README.md` - folder map for the mock-data layer.
- `adminMockData.js` (`DRAFT`) - standalone azienda-side customer overview records for the `/admin` console, including service plans, alert volume mixes, and per-customer mock `alerts` arrays reused by both admin routes.
- `mockData.js` - centralized shared entities: `farmType` (including compact profile identity keys such as `cropType`, `soilType`, `plotBlocks`, `irrigationProfile`, `monitoringMode`), `field`, `alertSource`, `integration`, and farm-aware alert templates including provenance copy (`relevanceReasons`, `sourceContributions`).
- `selectors.js` - source-of-truth selectors that derive farm-specific alerts, source-level provenance details, and linked feed context from shared entities.

Why this lives alone
- Shared domain data is intentionally centralized so route files stay presentation-focused.
- Selectors in this folder own linking logic between alerts, fields, sources, and integrations.

Non-obvious behavior
- `adminMockData.js` intentionally stays separate from farmer-facing mock entities so the `/admin` console can evolve without coupling its filters, totals, or detail drill-downs to the farmer dashboard data.
