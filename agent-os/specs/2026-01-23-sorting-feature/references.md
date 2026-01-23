# References

## Existing Patterns

### SearchForm Component (`src/lib/SearchForm.svelte`)
- Uses `$effect()` to trigger search on filter/term changes
- Imports settings from `$lib/settings`
- Updates stores for cross-component communication

### PackageList Component (`src/lib/PackageList.svelte`)
- Subscribes to stores using `$` prefix
- Uses scoped SCSS for styling
- Handles pagination via `loadMore()` function

### Search Module (`src/lib/search.ts`)
- `doSearch()` function builds Typesense queries
- Current `sort_by` hardcoded at line 95
- Supports pagination with `page` and `append` parameters

### Stores (`src/lib/stores.ts`)
- Pattern: `export const store_name = writable<Type>(initialValue)`
- Pagination stores: `current_page`, `is_loading`, `has_more`, `total_found`

### Settings (`src/lib/settings.ts`)
- Pattern for options: `{ value: string, title: string }[]`
- Example: `package_types` array
