# Scoped SCSS Styles

All components use scoped SCSS for style isolation and SCSS features.

```svelte
<style lang="scss">
  .package {
    --box-padding: 0.8em;
    display: grid;

    .title {
      h2 {
        margin-bottom: 0;
      }
    }
  }

  @media (min-width: 800px) {
    .package {
      grid-template-columns: 3.3fr 2fr;
    }
  }
</style>
```

- Always use `<style lang="scss">` in components
- Styles are automatically scoped to the component
- Use nesting for cleaner selectors
- Global styles only in `app.scss` and `variables.scss`
- Use `:global()` sparingly when targeting child component elements
