# Plan: URL Parameter Synchronization for pyf-gui

## Summary

Add search filters and terms to URL parameters to enable shareable links and preserve state on browser reload.

## URL Schema

| Param | Format | Example |
|-------|--------|---------|
| `q` | search term | `q=collective` |
| `version` | comma-separated versions | `version=6.1,6.0` |
| `type` | short codes | `type=addon,theme` |
| `sort` | field:direction | `sort=upload_timestamp:desc` |

**Example URLs:**
- `/?q=collective&version=6.1,6.0&type=addon`
- `/?version=6.0,5.2` (defaults for q and type)

## Priority Order

URL params > localStorage > defaults

## Tasks

### Task 1: Create URL serialization utilities
**File:** `src/lib/urlParams.ts` (new)

- `parseUrlParams()` - parse URLSearchParams to search state
- `serializeToUrl()` - convert state to URLSearchParams
- `hasSearchParams()` - check if URL has search params
- `buildUrlString()` - build URL string from params
- Type short codes mapping (addon, theme, core, distribution)
- Interface `UrlSearchState` for type safety

### Task 2: Create SvelteKit load function
**File:** `src/routes/+page.ts` (new)

- Parse URL params on initial load
- Pass `urlParams` and `urlHasParams` to page component

### Task 3: Update page component
**File:** `src/routes/+page.svelte`

- Accept `data` from load function via `$props()`
- Pass `urlParams` and `urlHasParams` to SearchForm

### Task 4: Update SearchForm for URL sync
**File:** `src/lib/SearchForm.svelte`

- Accept URL params as props (`urlParams`, `urlHasParams`)
- Initialization: URL > localStorage > defaults (in `onMount`)
- Add `$effect()` to handle browser back/forward with `$page` subscription
- Add `updateUrl()` function using `goto()` with `replaceState: true`
- Add `$effect()` to update URL on filter changes (immediate)
- Add `$effect()` to update URL on search term changes (300ms debounce)
- Use `isUrlUpdate` flag to prevent circular updates

### Task 5: Update PackageList for sort in URL
**File:** `src/lib/PackageList.svelte`

- Sort changes flow through `search_sort` store
- SearchForm subscribes to store and updates URL

## Key Implementation Details

1. **No pagination in URL** - Infinite scroll means page number is transient
2. **Clean URLs** - Omit params that match defaults (no `?q=*`)
3. **Circular update prevention** - Use `isUrlUpdate` flag when syncing from URL
4. **SSR safe** - Load function runs on server, goto() only on client
5. **Version format** - Use `version` param (not `plone`), strip "Plone " prefix

## Verification

1. Load `/?q=collective&version=6.1&type=addon` - verify filters applied
2. Change filters - verify URL updates without page reload
3. Use browser back button - verify previous state restored
4. Share URL in new tab - verify same search results load
5. Load `/` with localStorage filters - verify localStorage loads
6. Clear all filters - verify URL returns to clean `/`
