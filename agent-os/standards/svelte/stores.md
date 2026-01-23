# Store-based State

Use Svelte writable stores in `src/lib/stores.ts` for shared state.

```typescript
import { writable } from 'svelte/store';
import type { Filter, GroupedHit } from '$lib/interfaces';

export const package_list = writable<GroupedHit[]>([]);
export const search_filter = writable<Filter>({ plone_versions: [], package_types: [] });
export const is_loading = writable<boolean>(false);
```

**In components:**
```svelte
<script lang="ts">
  import { package_list, is_loading } from '$lib/stores';
</script>

{#if $is_loading}
  <span>Loading...</span>
{/if}
```

- Use stores for state shared across components
- Keep component-local state in `$state()` runes
- Type stores with generics: `writable<Type>()`
- Access store values in templates with `$store` syntax
