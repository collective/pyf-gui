# References for URL Parameter Synchronization

## Similar Implementations

### localStorage persistence

- **Location:** `src/lib/localStorage.ts`
- **Relevance:** Existing state persistence pattern for filters
- **Key patterns:**
  - `loadFilterSettings()` / `saveFilterSettings()` for filter state
  - `loadSortSetting()` / `saveSortSetting()` for sort state
  - Default fallbacks when no stored value exists

### Search state management

- **Location:** `src/lib/stores.ts`
- **Relevance:** Writable stores for shared state across components
- **Key patterns:**
  - `search_term`, `search_filter`, `search_sort` stores
  - `sort_initialized` flag for proper initialization sequencing

### SvelteKit load functions

- **Location:** SvelteKit documentation
- **Relevance:** Server-side data loading pattern
- **Key patterns:**
  - `PageLoad` type for type-safe load functions
  - Access to `url.searchParams` for URL param parsing
  - Return object passed to page component via `$props()`
