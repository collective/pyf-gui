// Shared page state using Svelte 5 runes
export const pageState = $state({
  title: null as string | null,
  version: null as string | null,
  showMobileFilter: false,
  filtersExpanded: false,
  searchTerm: '',  // Sync mobile header search with SearchForm
});
