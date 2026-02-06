// Shared page state using Svelte 5 runes
// UI-only state for layout concerns (mobile, header display)
// Search state lives in search-state.svelte.ts
export const pageState = $state({
  title: null as string | null,
  version: null as string | null,
  showMobileFilter: false,
  filtersExpanded: false,
  searchTerm: '',  // Mobile header search input value (syncs with searchState.term)
});
