In the admin page, make the filters bar sticky so it behaves like this:

- when the page is at the top, the filters stay in their normal place
- as soon as the user scrolls down, the filters remain pinned to the top of the viewport
- keep the current layout and spacing
- make sure the sticky bar has a subtle background/backdrop so the cards do not show through awkwardly while scrolling
- do not make the whole page fixed, only the filters area
- keep it working on mobile too

Apply the change in the admin page files only.

Implementation details:
1. In `src/pages/AdminPage.jsx`, wrap the filter `SectionCard` in a dedicated wrapper class, for example:
   - `div.admin-toolbar-sticky > SectionCard > div.admin-toolbar`

2. In `src/pages/admin.css`, add sticky styles like:
   - `position: sticky`
   - `top: 0`
   - a sufficiently high `z-index`
   - light background / blur / bottom spacing so it looks clean while scrolling

3. Keep parent containers compatible with sticky behavior:
   - do not add `overflow: hidden` on ancestors
   - preserve the current grid below it

Use a patch similar to this idea:

`AdminPage.jsx`
- replace the standalone filter `SectionCard` with:

<div className="admin-toolbar-sticky">
  <SectionCard>
    <div className="admin-toolbar">
      ...existing filters unchanged...
    </div>
  </SectionCard>
</div>

`admin.css`
Add:

.admin-toolbar-sticky {
  position: sticky;
  top: 0;
  z-index: 20;
  padding-bottom: 0.35rem;
  background: linear-gradient(180deg, rgba(248, 251, 246, 0.98), rgba(248, 251, 246, 0.9) 78%, rgba(248, 251, 246, 0));
  backdrop-filter: blur(6px);
}

.admin-toolbar-sticky > .section-card {
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(32, 51, 37, 0.08);
}

@media (max-width: 700px) {
  .admin-toolbar-sticky {
    top: 0;
  }
}

Important:
- do not change the filter logic
- do not redesign the cards
- only make the filters stay visible at the top while scrolling