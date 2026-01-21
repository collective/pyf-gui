import { writable } from 'svelte/store';
import type { VersionInfo, GroupedHit } from '$lib/interfaces';

export const package_list = writable<GroupedHit[]>([]);

let versions: VersionInfo[] = []

export const results_count = writable({});
export const search_filter = writable({});
export const search_term = writable("*");
export const search_classifiers = writable([]);
export const plone_versions = writable(versions);
export const python_versions = writable([]);
