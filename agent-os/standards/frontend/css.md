## CSS best practices

- **CSS/SCSS**: Use plain CSS or SCSS for styling and use custom properties (CSS variables) for theming
- **Semantic classes**: Use only semantic classes and BEM, not utility classes which rebuild native CSS
- **CSS Layers**: Use CSS layers to organize and prioritize styles
- **Consistent Methodology**: Apply and stick to the project's consistent CSS methodology across the entire project
- **Avoid Overriding Framework Styles**: Work with your framework's patterns rather than fighting against them with excessive overrides
- **Maintain Design System**: Establish and document design tokens (colors, spacing, typography) for consistency
- **Minimize Custom CSS**: Leverage framework utilities and components to reduce custom CSS maintenance burden
- **Performance Considerations**: Optimize for production with CSS purging/tree-shaking to remove unused styles

---

## CSS Layers for Whitelabeling

CSS Cascade Layers (`@layer`) provide explicit control over the cascade, enabling predictable style overrides without specificity battles. This is essential for whitelabeling support where client-specific branding must cleanly override base styles.

### Why CSS Layers Matter for Theming

- **Predictable cascade**: Layers are ordered by declaration, not specificity
- **Clean overrides**: Brand styles always win without `!important` or complex selectors
- **Framework integration**: Wrap Bootstrap/external CSS in lower-priority layers
- **Component isolation**: Svelte scoped styles remain high priority by default
- **Browser support**: 95%+ coverage (Chrome 99+, Firefox 97+, Safari 15.4+) — no polyfill needed

### Key Concepts

1. **Layer priority**: Later layers in the declaration order have higher priority
2. **Unlayered CSS**: Styles outside any `@layer` have the highest priority
3. **Nested layers**: Layers can be nested for fine-grained control (e.g., `components.cards`)

---

## Recommended Layer Hierarchy

Declare all layers at the top of your main stylesheet to establish the cascade order:

```scss
// app.scss - Layer order declaration (first = lowest priority)
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;
```

| Layer | Priority | Purpose |
|-------|----------|---------|
| `reset` | 1 (lowest) | CSS reset/normalize styles |
| `bootstrap` | 2 | Bootstrap framework styles |
| `theme` | 3 | Design tokens and CSS custom properties |
| `layout` | 4 | Page structure, grid systems |
| `components` | 5 | Application component styles |
| `utilities` | 6 | Helper classes (spacing, visibility) |
| `customization` | 7 | Project-specific overrides |
| `brand` | 8 (highest) | Client whitelabel styles |

---

## Layer Declaration in SCSS

### Main Entry Point (`app.scss`)

```scss
// 1. Declare layer order first (establishes priority)
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;

// 2. Import reset into its layer
@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    line-height: 1.5;
  }
}

// 3. Bootstrap variables (must be before Bootstrap import)
@use 'variables' as *;

// 4. Bootstrap in its layer
@layer bootstrap {
  @import 'bootstrap/scss/bootstrap';
}

// 5. Theme tokens layer
@layer theme {
  :root {
    // Semantic tokens derived from Bootstrap variables
    --color-primary: #{$primary};
    --color-secondary: #{$secondary};
    --color-background: #{$body-bg};
    --color-text: #{$body-color};

    // Spacing tokens
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    // Typography tokens
    --font-family-base: #{$font-family-base};
    --font-size-base: #{$font-size-base};
    --line-height-base: #{$line-height-base};
  }
}

// 6. Layout styles
@layer layout {
  @import 'layout';
}

// 7. Component styles (if using separate files)
@layer components {
  @import 'components/cards';
  @import 'components/forms';
}
```

---

## SCSS + Layers Integration

### Nested Layer Declarations

SCSS allows nesting layers for granular organization:

```scss
@layer components {
  // All component styles go here

  .package-card {
    background: var(--package-card-bg, var(--color-background));
    border-radius: var(--package-card-radius, 0.5rem);
    padding: var(--spacing-md);
  }

  .search-form {
    display: flex;
    gap: var(--spacing-sm);
  }
}
```

### SCSS Variables vs CSS Custom Properties

Understanding when to use each:

| Type | Compilation | Use Case |
|------|-------------|----------|
| SCSS variables (`$primary`) | Compile-time | Bootstrap config, calculations |
| CSS custom properties (`--color-primary`) | Runtime | Theming, whitelabeling, dynamic values |

```scss
// variables.scss
$primary: #0095d3;  // Compile-time: configures Bootstrap

// theme layer
@layer theme {
  :root {
    --color-primary: #{$primary};  // Runtime: available for overrides
  }
}
```

---

## Svelte Component Styles Strategy

Svelte's scoped styles naturally have high specificity because they're transformed with unique class names. To make components themeable:

### Use CSS Custom Properties for Brand Flexibility

```svelte
<!-- PackageCard.svelte -->
<div class="package-card">
  <h3>{packageName}</h3>
  <p>{description}</p>
</div>

<style lang="scss">
  .package-card {
    // Use component tokens with fallbacks
    background: var(--package-card-bg, var(--color-background));
    border: 1px solid var(--package-card-border, var(--color-border, #e0e0e0));
    border-radius: var(--package-card-radius, 0.5rem);
    padding: var(--package-card-padding, var(--spacing-md));

    h3 {
      color: var(--package-card-title-color, var(--color-text));
      font-size: var(--package-card-title-size, 1.25rem);
    }

    p {
      color: var(--package-card-text-color, var(--color-text-muted, #666));
    }
  }
</style>
```

### Component Token Pattern

Define component-specific tokens that fall back to semantic tokens:

```
var(--component-property, var(--semantic-token, hardcoded-fallback))
```

This creates a three-tier system:
1. **Component token** (`--package-card-bg`) — brand can override specific components
2. **Semantic token** (`--color-background`) — theme-level consistency
3. **Hardcoded fallback** — ensures styles work without tokens

---

## Whitelabeling Strategy

### Brand Layer Architecture

The `brand` layer is the highest-priority layer, reserved for client-specific overrides:

```scss
// brand.scss - Client-specific overrides
@layer brand {
  :root {
    // Override theme tokens
    --color-primary: #ff6600;
    --color-secondary: #003366;

    // Override component tokens
    --package-card-bg: #f5f5f5;
    --package-card-radius: 0;

    // Add brand-specific tokens
    --brand-logo-height: 48px;
  }

  // Brand-specific component overrides
  .header {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  }
}
```

### Creating Brand Override Files

Structure for multiple clients:

```
src/
├── brands/
│   ├── _base.scss        # Shared brand utilities
│   ├── acme-corp.scss    # Client A
│   ├── globex.scss       # Client B
│   └── initech.scss      # Client C
└── app.scss
```

### Loading Brand Styles

**Option 1: Static Import (Build-time)**

```scss
// app.scss
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;

// ... base layers ...

// Import specific brand at build time
@import 'brands/acme-corp';
```

**Option 2: Dynamic Import (Runtime)**

```svelte
<!-- +layout.svelte -->
<script>
  import { onMount } from 'svelte';

  export let data;

  onMount(async () => {
    if (data.brandId) {
      const brandStyles = document.createElement('link');
      brandStyles.rel = 'stylesheet';
      brandStyles.href = `/brands/${data.brandId}.css`;
      document.head.appendChild(brandStyles);
    }
  });
</script>
```

**Option 3: CSS Custom Property Injection**

```svelte
<!-- +layout.svelte -->
<script>
  export let data;
</script>

<svelte:head>
  {#if data.brandConfig}
    <style>
      :root {
        --color-primary: {data.brandConfig.primaryColor};
        --color-secondary: {data.brandConfig.secondaryColor};
      }
    </style>
  {/if}
</svelte:head>
```

---

## Example Brand Override File

```scss
// brands/acme-corp.scss
@layer brand {
  :root {
    // Brand colors
    --color-primary: #e74c3c;
    --color-secondary: #2c3e50;
    --color-accent: #f39c12;

    // Override semantic tokens
    --color-background: #fafafa;
    --color-text: #2c3e50;
    --color-text-muted: #7f8c8d;

    // Component-specific overrides
    --header-bg: var(--color-secondary);
    --header-text: #ffffff;
    --footer-bg: var(--color-secondary);

    // Package cards
    --package-card-bg: #ffffff;
    --package-card-border: #ecf0f1;
    --package-card-radius: 8px;
    --package-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    // Buttons
    --btn-primary-bg: var(--color-primary);
    --btn-primary-hover-bg: #c0392b;

    // Typography
    --font-family-base: 'Roboto', sans-serif;
    --font-family-heading: 'Montserrat', sans-serif;
  }

  // Brand-specific structural changes
  .header {
    background: var(--header-bg);
    border-bottom: 3px solid var(--color-accent);
  }

  .header__logo {
    content: url('/brands/acme-corp/logo.svg');
    height: var(--brand-logo-height, 40px);
  }

  // Override button styles
  .btn-primary {
    background: var(--btn-primary-bg);
    border-color: var(--btn-primary-bg);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover {
      background: var(--btn-primary-hover-bg);
      border-color: var(--btn-primary-hover-bg);
    }
  }
}
```

---

## CSS Custom Properties + Layers Token Hierarchy

Design tokens flow through multiple levels:

```
Bootstrap SCSS Variables ($primary)
         ↓
Bootstrap CSS Variables (--bs-primary)
         ↓
Semantic Tokens (--color-primary)
         ↓
Component Tokens (--package-card-bg)
         ↓
Brand Overrides (@layer brand)
```

### Token Definition Example

```scss
// variables.scss (SCSS compile-time)
$primary: #0095d3;

// app.scss theme layer (runtime tokens)
@layer theme {
  :root {
    --color-primary: #{$primary};
    --color-primary-light: #{lighten($primary, 15%)};
    --color-primary-dark: #{darken($primary, 15%)};
  }
}

// Component usage (with fallback chain)
@layer components {
  .sidebar__link--active {
    background: var(--sidebar-link-active-bg, var(--color-primary-light));
    border-left: 3px solid var(--sidebar-link-active-border, var(--color-primary));
  }
}

// Brand override (highest priority)
@layer brand {
  :root {
    --color-primary: #e74c3c;
    --sidebar-link-active-bg: #fadbd8;
  }
}
```

---

## Complete Example: `app.scss`

```scss
// ============================================
// Layer Order Declaration
// ============================================
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;

// ============================================
// Bootstrap Configuration (before import)
// ============================================
@use 'variables' as *;

// ============================================
// Reset Layer
// ============================================
@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
  }

  img,
  svg {
    display: block;
    max-width: 100%;
  }
}

// ============================================
// Bootstrap Layer
// ============================================
@layer bootstrap {
  @import 'bootstrap/scss/bootstrap';
}

// ============================================
// Theme Layer (Design Tokens)
// ============================================
@layer theme {
  :root {
    // Color tokens
    --color-primary: #{$primary};
    --color-secondary: #{$secondary};
    --color-success: #{$success};
    --color-warning: #{$warning};
    --color-danger: #{$danger};

    --color-background: #{$body-bg};
    --color-surface: #ffffff;
    --color-border: #dee2e6;

    --color-text: #{$body-color};
    --color-text-muted: #6c757d;
    --color-text-inverse: #ffffff;

    // Spacing scale
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;

    // Typography
    --font-family-base: #{$font-family-base};
    --font-family-mono: #{$font-family-monospace};
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;

    // Shadows
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    // Transitions
    --transition-fast: 150ms ease;
    --transition-base: 250ms ease;
    --transition-slow: 350ms ease;

    // Border radius
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 1rem;
    --radius-full: 9999px;
  }
}

// ============================================
// Layout Layer
// ============================================
@layer layout {
  .app-layout {
    display: grid;
    grid-template-areas:
      "header header"
      "sidebar content"
      "footer footer";
    grid-template-columns: var(--sidebar-width, 280px) 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
  }

  .header { grid-area: header; }
  .sidebar { grid-area: sidebar; }
  .content { grid-area: content; }
  .footer { grid-area: footer; }
}

// ============================================
// Components Layer
// ============================================
@layer components {
  // Import component stylesheets
  // @import 'components/package-card';
  // @import 'components/search-form';
}

// ============================================
// Utilities Layer
// ============================================
@layer utilities {
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// ============================================
// Customization Layer (Project-specific)
// ============================================
@layer customization {
  // Project-specific overrides go here
}

// ============================================
// Brand Layer (Whitelabeling)
// ============================================
// @import 'brands/client-name';
```

---

## Migration Guide

### Step 1: Add Layer Declaration

Add the layer order at the top of `app.scss`:

```scss
@layer reset, bootstrap, theme, layout, components, utilities, customization, brand;
```

### Step 2: Wrap Bootstrap Import

```scss
// Before
@import 'bootstrap/scss/bootstrap';

// After
@layer bootstrap {
  @import 'bootstrap/scss/bootstrap';
}
```

### Step 3: Create Theme Token Layer

Extract hardcoded values into CSS custom properties:

```scss
@layer theme {
  :root {
    --color-primary: #{$primary};
    // ... other tokens
  }
}
```

### Step 4: Update Component Styles

Replace hardcoded values with token references:

```scss
// Before
.card {
  background: #ffffff;
  border-radius: 8px;
}

// After
.card {
  background: var(--card-bg, var(--color-surface));
  border-radius: var(--card-radius, var(--radius-md));
}
```

### Step 5: Create Brand Layer Structure

Create the brands directory and base template:

```scss
// brands/_template.scss
@layer brand {
  :root {
    // Override tokens here
  }
}
```

### Compatibility Notes

- **Svelte scoped styles**: Work alongside layers without modification (they remain high specificity)
- **`:global()` in Svelte**: Use when you need component styles to participate in layer cascade
- **Dynamic styles**: `style:` directives in Svelte always have highest priority
