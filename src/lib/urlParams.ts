import { default_plone_versions, default_package_types, default_sort, default_language, type Language } from './settings';

// Type short codes for URL params
const TYPE_CODES: Record<string, string> = {
  'Framework :: Plone :: Addon': 'addon',
  'Framework :: Plone :: Theme': 'theme',
  'Framework :: Plone :: Core': 'core',
  'Framework :: Plone :: Distribution': 'distribution'
};

const CODE_TO_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_CODES).map(([k, v]) => [v, k])
);

export interface UrlSearchState {
  searchTerm: string;
  ploneVersions: string[];
  packageTypes: string[];
  sort: string;
  language: Language;
  hasExplicitSort: boolean;  // true when sort param was explicitly in URL
}

/**
 * Parse URL search params into search state
 */
export function parseUrlParams(params: URLSearchParams): UrlSearchState {
  const q = params.get('q');
  const version = params.get('version');
  const type = params.get('type');
  const sort = params.get('sort');
  const lang = params.get('lang');

  // Map lang param: 'js' -> 'javascript', default to 'python'
  let language: Language = default_language;
  if (lang === 'js') {
    language = 'javascript';
  }

  return {
    searchTerm: q || '*',
    ploneVersions: version
      ? version.split(',').map(v => `Plone ${v.trim()}`)
      : [...default_plone_versions],
    packageTypes: type
      ? type.split(',').map(code => CODE_TO_TYPE[code.trim()]).filter(Boolean)
      : [...default_package_types],
    sort: sort || default_sort,
    language,
    hasExplicitSort: sort !== null  // true when sort param was explicitly in URL
  };
}

/**
 * Convert search state to URLSearchParams
 * Omits params that match defaults for clean URLs
 */
export function serializeToUrl(state: UrlSearchState): URLSearchParams {
  const params = new URLSearchParams();

  // Only add q if it's not the default wildcard
  if (state.searchTerm && state.searchTerm !== '*' && state.searchTerm.trim() !== '') {
    params.set('q', state.searchTerm);
  }

  // Only add version if different from defaults
  const sortedVersions = [...state.ploneVersions].sort();
  const sortedDefaults = [...default_plone_versions].sort();
  if (JSON.stringify(sortedVersions) !== JSON.stringify(sortedDefaults)) {
    const versionCodes = state.ploneVersions
      .map(v => v.replace('Plone ', ''))
      .join(',');
    if (versionCodes) {
      params.set('version', versionCodes);
    }
  }

  // Only add type if different from defaults
  const sortedTypes = [...state.packageTypes].sort();
  const sortedDefaultTypes = [...default_package_types].sort();
  if (JSON.stringify(sortedTypes) !== JSON.stringify(sortedDefaultTypes)) {
    const typeCodes = state.packageTypes
      .map(t => TYPE_CODES[t])
      .filter(Boolean)
      .join(',');
    if (typeCodes) {
      params.set('type', typeCodes);
    }
  }

  // Add sort if different from default, or if explicitly set by the user
  // (so a reload preserves the choice even when it matches the default)
  if (state.sort && (state.sort !== default_sort || state.hasExplicitSort)) {
    params.set('sort', state.sort);
  }

  // Only add lang if JavaScript is selected (Python is default)
  if (state.language === 'javascript') {
    params.set('lang', 'js');
  }

  return params;
}

/**
 * Check if URL has any search-related params
 */
export function hasSearchParams(params: URLSearchParams): boolean {
  return params.has('q') || params.has('version') || params.has('type') || params.has('sort') || params.has('lang');
}

/**
 * Build URL string from params, returns empty string if no params
 */
export function buildUrlString(params: URLSearchParams): string {
  const paramString = params.toString();
  return paramString ? `?${paramString}` : '';
}
