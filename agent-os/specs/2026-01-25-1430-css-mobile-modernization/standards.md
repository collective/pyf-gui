# Applied CSS Standards

## CSS Layers (frontend/css)

### Layer Order
```scss
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;
```

### Usage Rules
1. All global styles must be wrapped in appropriate layers
2. Bootstrap imports go in `@layer bootstrap`
3. Design tokens defined in `@layer theme`
4. Page layout styles in `@layer layout`
5. Component-specific styles in `@layer components`

## Design Tokens (frontend/custom-properties)

### Color Tokens
```css
:root {
  --color-primary: #0095d3;
  --color-secondary: #fffdda;
  --color-background: #fff;
  --color-text: #333;
  --color-text-muted: #666;
  --color-border: #d3d3d3;
  --color-accent: #ff6600;
}
```

### Spacing Tokens
```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}
```

### Typography Tokens
```css
:root {
  --font-family-base: Verdana, Geneva, Tahoma, sans-serif;
  --font-size-base: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Layout Tokens
```css
:root {
  --sidebar-width: clamp(24ch, 28ch, 30ch);
  --content-width: clamp(60ch, 90ch, 110ch);
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
}
```

## Responsive Design (frontend/responsive)

### Breakpoints (SCSS)
```scss
$breakpoint-sm: 480px;
$breakpoint-md: 640px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

### Mobile-First Pattern
```scss
// Default: mobile styles
.element {
  flex-direction: column;
}

// Desktop: override
@media (min-width: $breakpoint-md) {
  .element {
    flex-direction: row;
  }
}
```

### Touch-Friendly Targets
- Minimum touch target: 44x44px
- Minimum spacing between interactive elements: 8px

## BEM Naming Convention

### Pattern
```
.block__element--modifier
```

### Examples
```scss
.search-form { }
.search-form__field { }
.search-form__label { }
.search-form__more-toggle { }
.search-form__more-toggle--active { }

.filter-toggle { }
.filter-toggle__icon { }
.filter-toggle__label { }
.filter-toggle--expanded { }
```

### Rules
1. Block: Standalone component (`.search-form`)
2. Element: Part of block (`.search-form__field`)
3. Modifier: Variation (`.search-form--compact`)
4. Use double underscore for elements, double dash for modifiers
5. Never nest BEM selectors deeper than one level

## Component Styles

### Scoped Styles Pattern
```svelte
<style lang="scss">
  .component {
    /* Component root */
  }

  .component__element {
    /* Scoped to component */
  }
</style>
```

### Global Overrides
```svelte
<style lang="scss">
  .component :global(.bootstrap-class) {
    /* Override Bootstrap within component */
  }
</style>
```

## Accessibility Requirements

### Focus States
- All interactive elements must have visible focus indicators
- Focus indicators must have 3:1 contrast ratio

### Color Contrast
- Text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
