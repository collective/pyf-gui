// localStorage utility module for persisting user preferences
// Handles SSR gracefully by checking for window availability

import { default_plone_versions, default_package_types, default_sort, default_language, type Language } from './settings';

// localStorage keys
const KEYS = {
  PLONE_VERSIONS: 'pyf_plone_versions',
  PACKAGE_TYPES: 'pyf_package_types',
  SORT: 'pyf_sort',
  LANGUAGE: 'pyf_language'
} as const;

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Save filter settings to localStorage
 */
export function saveFilterSettings(ploneVersions: string[], packageTypes: string[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(KEYS.PLONE_VERSIONS, JSON.stringify(ploneVersions));
    localStorage.setItem(KEYS.PACKAGE_TYPES, JSON.stringify(packageTypes));
  } catch (e) {
    console.warn('Failed to save filter settings to localStorage:', e);
  }
}

/**
 * Save sort setting to localStorage
 */
export function saveSortSetting(sort: string): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(KEYS.SORT, sort);
  } catch (e) {
    console.warn('Failed to save sort setting to localStorage:', e);
  }
}

/**
 * Load filter settings from localStorage
 * Returns defaults if not found or on SSR
 */
export function loadFilterSettings(): { ploneVersions: string[]; packageTypes: string[] } {
  if (!isBrowser()) {
    return {
      ploneVersions: [...default_plone_versions],
      packageTypes: [...default_package_types]
    };
  }

  try {
    const storedVersions = localStorage.getItem(KEYS.PLONE_VERSIONS);
    const storedTypes = localStorage.getItem(KEYS.PACKAGE_TYPES);

    return {
      ploneVersions: storedVersions ? JSON.parse(storedVersions) : [...default_plone_versions],
      packageTypes: storedTypes ? JSON.parse(storedTypes) : [...default_package_types]
    };
  } catch (e) {
    console.warn('Failed to load filter settings from localStorage:', e);
    return {
      ploneVersions: [...default_plone_versions],
      packageTypes: [...default_package_types]
    };
  }
}

/**
 * Load sort setting from localStorage
 * Returns default if not found or on SSR
 */
export function loadSortSetting(): string {
  if (!isBrowser()) {
    return default_sort;
  }

  try {
    const storedSort = localStorage.getItem(KEYS.SORT);
    return storedSort || default_sort;
  } catch (e) {
    console.warn('Failed to load sort setting from localStorage:', e);
    return default_sort;
  }
}

/**
 * Save language setting to localStorage
 */
export function saveLanguageSetting(language: Language): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(KEYS.LANGUAGE, language);
  } catch (e) {
    console.warn('Failed to save language setting to localStorage:', e);
  }
}

/**
 * Load language setting from localStorage
 * Returns default if not found or on SSR
 */
export function loadLanguageSetting(): Language {
  if (!isBrowser()) {
    return default_language;
  }

  try {
    const storedLanguage = localStorage.getItem(KEYS.LANGUAGE);
    if (storedLanguage === 'python' || storedLanguage === 'javascript') {
      return storedLanguage;
    }
    return default_language;
  } catch (e) {
    console.warn('Failed to load language setting from localStorage:', e);
    return default_language;
  }
}
