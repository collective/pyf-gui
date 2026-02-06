import { writable } from 'svelte/store';
import type { VersionInfo, GroupedHit, Filter } from '$lib/interfaces';
import { default_sort, default_language, type Language } from '$lib/settings';

export const package_list = writable<GroupedHit[]>([]);

let versions: VersionInfo[] = []

export const results_count = writable({});
export const search_filter = writable<Filter>({ plone_versions: [], package_types: [] });
export const search_term = writable<string>("*");
export const search_classifiers = writable([]);
export const plone_versions = writable(versions);
export const python_versions = writable([]);

// Pagination state stores
export const current_page = writable<number>(1);
export const is_loading = writable<boolean>(false);
export const has_more = writable<boolean>(true);
export const total_found = writable<number>(0);

// Sort state store
export const search_sort = writable<string>(default_sort);

// Sort initialization state - tracks when sort preference is loaded from localStorage
export const sort_initialized = writable<boolean>(false);

// Language/registry store
export const search_language = writable<Language>(default_language);

// Track when user explicitly selects a sort option (vs auto-relevance)
export const user_selected_sort = writable<boolean>(false);
