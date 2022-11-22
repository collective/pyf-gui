import { writable } from 'svelte/store';
import type { VersionInfo } from '$lib/interfaces';

export const package_list = writable([
    {
        name: "plone.galley",
        version: "1.0.1",
        summary: "Photo gallery for Plone CMS."
    },
    {
        name: "plonecli",
        version: "2.0b1",
        summary: "A Plone CLI for creating Plone packages"
    },
]);

let versions: VersionInfo[] = []

export const results_count = writable({});
export const search_filter = writable({});
export const search_term = writable("*");
export const search_classifiers = writable([]);
export const plone_versions = writable(versions);
export const python_versions = writable([]);
