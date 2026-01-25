# CSS Custom Properties

Define component-level CSS custom properties for layout flexibility.

```svelte
<style lang="scss">
  .package {
    --box-padding: 0.8em;
    padding: var(--box-padding);
  }

  .versions-right {
    --downloads-padding: calc(var(--box-padding) / 2);
    padding: var(--downloads-padding);
  }
</style>
```

- Define `--var-name` at component root for consistent spacing
- Use `calc()` with custom properties for derived values
- Bootstrap `--bs-primary`, `--bs-secondary` for brand colors
- Plone blue: `#0095d3` defined as `$plone-blue` in `variables.scss`
