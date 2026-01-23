# Sorting Feature for Package Search Results

Add sorting options (Title A-Z, Title Z-A, Last Modified) to the main search results list using a Bootstrap select dropdown placed above results.

## Tasks

1. **Add Sort Options to Settings** - `src/lib/settings.ts`
2. **Add Sort Store** - `src/lib/stores.ts`
3. **Update Search Function for Dynamic Sorting** - `src/lib/search.ts`
4. **Add Sort Dropdown to PackageList** - `src/lib/PackageList.svelte`
5. **Wire Sort to Search Effect** - `src/lib/SearchForm.svelte`

## Implementation Details

### Sort Options
- Title A-Z (`name_sortable:asc`)
- Title Z-A (`name_sortable:desc`)
- Last Modified (`upload_timestamp:desc`)

### Search Behavior
When a search term is active, relevance scoring (`_text_match:desc`) is prepended to maintain search relevance. Without a search term, the selected sort order applies directly.

## Verification

1. Run `pnpm run dev` and test sort dropdown
2. Run `pnpm run check` for type checking
3. Run `pnpm run build` for build verification
