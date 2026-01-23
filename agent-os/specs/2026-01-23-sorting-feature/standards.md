# Standards Applied

## Svelte Stores
- Use `writable` from `svelte/store` for reactive state
- Export stores from `src/lib/stores.ts`
- Use `$store` syntax for reactive subscriptions in components

## Svelte 5 Runes
- Use `$state()` for component-local reactive state
- Use `$effect()` for side effects triggered by state changes
- Use `$derived()` for computed values

## Scoped SCSS
- Component styles in `<style lang="scss">` blocks
- Scoped by default to component
- Use `:global()` only when necessary for Bootstrap overrides

## Settings Constants
- Export configuration constants from `src/lib/settings.ts`
- Use typed arrays for option lists
- Export default values alongside options

## TypeScript
- Define interfaces in `src/lib/interfaces.ts`
- Use proper typing for function parameters and return values
