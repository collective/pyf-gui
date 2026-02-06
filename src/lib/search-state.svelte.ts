import { default_sort, default_language, default_plone_versions, default_package_types, type Language } from './settings';
import type { Filter, VersionInfo, GroupedHit } from './interfaces';

export const searchState = $state({
  // Search inputs (bound to form controls)
  term: '' as string,
  ploneVersions: [...default_plone_versions] as string[],
  packageTypes: [...default_package_types] as string[],
  sort: default_sort as string,
  language: default_language as Language,

  // Search results
  packageList: [] as GroupedHit[],
  totalFound: 0,

  // Facets
  ploneVersionsAvailable: [] as VersionInfo[],

  // Pagination
  currentPage: 1,
  hasMore: true,

  // Loading
  isLoading: false,

  // Initialization flags
  sortInitialized: false,
  userSelectedSort: false,
  initialized: false,
});

export function getHasActiveSearch() {
  return searchState.term !== '' && searchState.term !== '*';
}

export function getFilter(): Filter {
  return {
    plone_versions: searchState.ploneVersions,
    package_types: searchState.packageTypes,
  };
}

// Callback for when search input changes from external source (e.g. mobile header)
let _onSearchInput: (() => void) | null = null;

export function registerSearchInputHandler(handler: () => void) {
  _onSearchInput = handler;
}

export function notifySearchInput() {
  _onSearchInput?.();
}
