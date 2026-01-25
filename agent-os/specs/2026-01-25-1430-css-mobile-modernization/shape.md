# Shaping Decisions

## Problem Statement

The current CSS architecture uses basic SCSS with Bootstrap imports, but lacks:
- Modern CSS organization (layers, design tokens)
- Mobile-first responsive design
- Progressive disclosure for filter options (overwhelming for new users)

## Solution Shape

### CSS Layers Architecture

```
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;
```

**Why this order:**
1. `reset` - Minimal browser normalization
2. `bootstrap` - Framework defaults
3. `theme` - Design tokens (colors, spacing, typography)
4. `layout` - Page structure (grid, flexbox)
5. `components` - Component-specific styles
6. `utilities` - Helper classes
7. `customization` - User/project overrides
8. `brand` - Final brand-specific tweaks

### Design Tokens Strategy

**Color tokens:**
```css
--color-primary: #0095d3;      /* Plone blue */
--color-secondary: #fffdda;    /* Light cream */
--color-background: #fff;
--color-text: #333;
--color-text-muted: #666;
--color-border: #d3d3d3;
```

**Spacing tokens (8px base):**
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### Mobile-First Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| `$breakpoint-sm` | 480px | Large phones (landscape) |
| `$breakpoint-md` | 640px | Small tablets, sidebar appears |
| `$breakpoint-lg` | 1024px | Large tablets, laptops |
| `$breakpoint-xl` | 1280px | Desktops |

### Filter UX Decisions

**Primary vs Secondary filters:**
- Primary Plone versions: 5.2+ (most relevant for active development)
- Secondary Plone versions: < 5.2 (legacy, hidden by default)
- Primary package types: Addon, Distribution (most common)
- Secondary package types: Theme, Core (specialized, hidden by default)

**Toggle behavior:**
- Ellipsis button (`...`) is minimal, non-intrusive
- Secondary options appear below primary with smooth reveal
- State persists in localStorage (users who expanded once probably want it expanded)

### Mobile Layout Decisions

**Collapsed sidebar pattern:**
- Filter toggle button sticky at top of content area
- Sidebar slides in from left when expanded
- Backdrop overlay to indicate modal behavior
- Tap outside or toggle button to close

**Touch-friendly targets:**
- All interactive elements minimum 44x44px touch area
- Adequate spacing between filter options
- Large, easy-to-tap ellipsis buttons

## Trade-offs Considered

1. **CSS Layers vs. specificity management**
   - Chose layers for cleaner cascade control
   - Trade-off: Requires modern browser support (acceptable for this app's audience)

2. **Design tokens in CSS vs. SCSS variables**
   - Chose CSS custom properties for runtime theming capability
   - Trade-off: Slightly more verbose than SCSS variables

3. **Mobile-first vs. desktop-first**
   - Chose mobile-first for better progressive enhancement
   - Trade-off: More verbose desktop styles, but better mobile baseline

4. **Filter hiding vs. always visible**
   - Chose progressive disclosure with "more" toggles
   - Trade-off: Extra click for power users, but cleaner initial UX

## Out of Scope

- Dark mode support (future enhancement)
- Animation/transition refinement (basic transitions only)
- Print stylesheet
- RTL support
