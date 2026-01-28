# URL Parameter Synchronization — Shaping Notes

## Scope

Add search filters and terms to URL parameters to enable shareable links and preserve state on browser reload. Users can share direct links to filtered search results.

## Decisions

- **URL param naming**: Use `version` (not `plone`) and `type` (short codes) for brevity
- **Type short codes**: `addon`, `theme`, `core`, `distribution` map to full classifier strings
- **Priority order**: URL params > localStorage > defaults
- **Clean URLs**: Omit params that match defaults (e.g., no `?q=*` for empty search)
- **No pagination**: Infinite scroll means page number is transient state, not URL-worthy
- **Debounce strategy**: 300ms for search term, immediate for filter/sort changes
- **Circular update prevention**: `isUrlUpdate` flag prevents URL→state→URL loops

## Context

- **Visuals:** None
- **References:** Existing localStorage implementation in `src/lib/localStorage.ts`
- **Product alignment:** Enhances shareability and discoverability of Plone Add-on Gallery

## Standards Applied

- **svelte/runes** — Using `$effect()` for URL sync, `$state()` for local state, `$props()` for data from load function
- **typescript/interfaces** — `UrlSearchState` interface for type safety
- **javascript/utility-functions** — URL utilities in dedicated `urlParams.ts` module
