// Package type configuration with primary flag for progressive disclosure
export const package_types = [
  { value: "Framework :: Plone :: Addon", title: "Addon", primary: true },
  { value: "Framework :: Plone :: Distribution", title: "Distribution", primary: true },
  { value: "Framework :: Plone :: Theme", title: "Theme", primary: false },
  { value: "Framework :: Plone :: Core", title: "Core", primary: false }
];

// Plone version threshold for primary/secondary split
export const PRIMARY_PLONE_VERSION_THRESHOLD = "5.2";

// Default selected Plone versions
export const default_plone_versions = [
  "Plone 6.1",
  "Plone 6.0",
  "Plone 5.2"
];

// Default selected package types
export const default_package_types = [
  "Framework :: Plone :: Addon"
];

// Sort options for package list
export const sort_options = [
  { value: 'name_sortable:asc', title: 'Title A-Z' },
  { value: 'name_sortable:desc', title: 'Title Z-A' },
  { value: 'upload_timestamp:desc', title: 'Last Modified' }
];

// Relevance sort option - only shown when search term is active
export const relevance_sort_option = {
  value: '_text_match:desc',
  title: 'By Relevance'
};

export const default_sort = 'name_sortable:asc';
