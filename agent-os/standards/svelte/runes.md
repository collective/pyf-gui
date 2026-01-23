# Svelte 5 Runes

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
