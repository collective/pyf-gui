# CSS Modernization & Mobile Responsiveness Plan

## Summary

Modernize CSS/SCSS architecture using CSS layers and design tokens, implement mobile-first responsive layout with collapsible filters, and improve filter UX by hiding secondary options behind "more" toggles.

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-01-25-1430-css-mobile-modernization/` with:
- `plan.md` — This plan
- `shape.md` — Shaping decisions
- `standards.md` — Applied CSS standards

---

## Task 2: Fix Viewport Meta Tag

**File:** `src/app.html`

Change:
```html
<meta name="viewport" content="width=device-width" />
```
To:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## Task 3: Restructure app.scss with CSS Layers

**File:** `src/app.scss`

Add layer declaration at top:
```scss
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;
```

Wrap Bootstrap imports in `@layer bootstrap { ... }`

Add `@layer theme` with design tokens:
- Color tokens: `--color-primary`, `--color-secondary`, `--color-background`, etc.
- Spacing tokens: `--spacing-xs` through `--spacing-2xl`
- Typography tokens: `--font-family-base`, `--font-size-*`
- Layout tokens: `--sidebar-width`, `--content-width`

Convert layout styles to mobile-first in `@layer layout`:
- Default: `flex-direction: column` (mobile)
- `@media (min-width: 640px)`: grid layout (desktop)

---

## Task 4: Expand Design Tokens in variables.scss

**File:** `src/variables.scss`

Add:
- Spacing scale variables
- Breakpoint variables: `$breakpoint-sm: 480px`, `$breakpoint-md: 640px`, etc.

---

## Task 5: Update settings.ts - Reorder Package Types

**File:** `src/lib/settings.ts`

Reorder `package_types` array and add `primary` flag:
```typescript
export const package_types = [
  { value: "Framework :: Plone :: Addon", title: "Addon", primary: true },
  { value: "Framework :: Plone :: Distribution", title: "Distribution", primary: true },
  { value: "Framework :: Plone :: Theme", title: "Theme", primary: false },
  { value: "Framework :: Plone :: Core", title: "Core", primary: false }
];

export const PRIMARY_PLONE_VERSION_THRESHOLD = "5.2";
```

---

## Task 6: Update SearchForm.svelte with "More" Toggles

**File:** `src/lib/SearchForm.svelte`

### New State Variables:
- `showOlderVersions = $state(false)` — toggle for pre-5.2 versions
- `showMoreTypes = $state(false)` — toggle for Theme/Core

### Derived Data:
- `primaryVersions` — filter versions >= 5.2
- `olderVersions` — filter versions < 5.2
- `primaryTypes` — filter types where `primary: true`
- `secondaryTypes` — filter types where `primary: false`

### UI Changes:
1. **Plone versions**: Show primary versions, then ellipsis button, then older versions when expanded
2. **Add-on types**: Show Addon & Distribution, then ellipsis button, then Theme & Core when expanded

### Ellipsis Button (compact icon):
```svelte
<button class="search-form__more-toggle" onclick={toggleOlderVersions}>
  <svg viewBox="0 0 16 16">
    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5..."/>
  </svg>
</button>
```

### Style Updates:
- Convert to BEM naming (`search-form__*`)
- Use CSS custom properties throughout
- Add `.search-form__more-toggle` styles (32x32px button with hover effect)

---

## Task 7: Update +page.svelte for Mobile-First Layout

**File:** `src/routes/+page.svelte`

### New State:
- `filtersExpanded = $state(false)`

### Mobile Filter Toggle Button:
- Visible only on mobile (< 640px)
- Shows filter icon + "Filters" label + chevron
- Controls visibility of `<aside>`

### Layout Structure:
```svelte
<button class="filter-toggle">Filters</button>  <!-- mobile only -->
<aside class:expanded={filtersExpanded}>
  <SearchForm />
</aside>
<article>
  <PackageList />
</article>
```

### Styles (mobile-first):
```scss
.filter-toggle {
  display: flex;  // visible on mobile
  @media (min-width: 640px) {
    display: none;  // hidden on desktop
  }
}

aside {
  display: none;  // collapsed on mobile
  &.expanded { display: block; }

  @media (min-width: 640px) {
    display: block;  // always visible on desktop
    grid-area: sidebar;
  }
}
```

---

## Task 8: Update Component Styles with Design Tokens

### Files:
- `src/routes/+layout.svelte` — header/footer with BEM and tokens
- `src/lib/PackageList.svelte` — results header mobile-first
- `src/lib/PackageItem.svelte` — card styles with tokens

### Changes:
- Replace hardcoded colors with `var(--color-*)`
- Replace hardcoded spacing with `var(--spacing-*)`
- Apply BEM naming convention
- Ensure mobile-first media queries

---

## Critical Files

| File | Purpose |
|------|---------|
| `src/app.scss` | CSS layers + design tokens |
| `src/lib/SearchForm.svelte` | "More" toggles for types/versions |
| `src/routes/+page.svelte` | Mobile collapsible filter panel |
| `src/lib/settings.ts` | Reordered package types |
| `src/app.html` | Viewport meta fix |

---

## Standards Applied

- **frontend/css** — CSS layers, design tokens, BEM naming
- **frontend/responsive** — Mobile-first, standard breakpoints, touch-friendly
- **frontend/custom-properties** — Component-level CSS vars

---

## Verification

1. **Mobile (< 640px)**:
   - [ ] Filter panel collapsed by default
   - [ ] Tap "Filters" button expands/collapses panel
   - [ ] Content scrolls independently

2. **Desktop (>= 640px)**:
   - [ ] Sidebar always visible
   - [ ] No filter toggle button shown
   - [ ] Grid layout with sidebar + content

3. **Filter UX**:
   - [ ] Addon types: Addon, Distribution visible; Theme, Core behind ellipsis
   - [ ] Plone versions: 5.2+ visible; older versions behind ellipsis
   - [ ] Ellipsis buttons show/hide secondary options

4. **CSS Architecture**:
   - [ ] Layers cascade correctly
   - [ ] Design tokens work throughout
   - [ ] No visual regressions

5. **Run dev server**: `pnpm run dev` and test on mobile viewport
