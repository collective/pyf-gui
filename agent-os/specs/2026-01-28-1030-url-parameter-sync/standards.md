# Standards for URL Parameter Synchronization

The following standards apply to this work.

---

## svelte/runes

Use Svelte 5 runes for clearer, more predictable reactivity.

```svelte
<script lang="ts">
  // Props
  let { data } = $props();
  let { item } = $props<{ item: Package }>();

  // Local state
  let term = $state("");
  let showFilter = $state(true);

  // Derived values
  let filter = $derived<Filter>({
    plone_versions: pVersions,
    package_types: pTypes,
  });

  // Side effects
  $effect(() => {
    search_term.set(term);
    doSearch(term, filter);
  });
</script>
```

- Always use `$props()` for component props, never `export let`
- Use `$state()` for local reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects, replaces `$:` reactive statements

---

## typescript/interfaces

Define TypeScript interfaces co-located with their usage.

```typescript
// src/lib/interfaces.ts - shared domain types
export interface Package {
  name: string;
  version: string;
  summary?: string;
}

export interface Filter {
  plone_versions: string[];
  package_types: string[];
}
```

- Co-locate types with the code that uses them
- Use `interface` for object shapes, `type` for unions/aliases
- Export all interfaces for reuse across components
- Name interfaces as nouns: `Package`, `Filter`, `VersionInfo`

---

## javascript/utility-functions

Shared formatting and parsing functions live in `src/lib/utils.ts`.

```typescript
// Naming: verb + noun (getPloneVersions, formatNumber, toLocalizedTime)
export function getPloneVersions(classifiers: string[]): string[] { ... }
export function formatNumber(num: number | undefined): string { ... }
export function toLocalizedTime(uts: number): string { ... }
```

- Start in `utils.ts`, split into domain files when it grows large
- Export individual functions, not a default object
- Use TypeScript types for parameters and return values
- Keep functions pure when possible (no side effects)
