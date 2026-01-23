// export let api_url:string;

export const default_plone_versions = [
  "Plone 6.1",
  "Plone 6.0",
  "Plone 5.2"
];

export const default_package_types = [
  "Framework :: Plone :: Addon",
  // "Framework :: Plone :: Theme",
  // "Framework :: Plone :: Distribution"
];

export const package_types = [
  { value: "Framework :: Plone :: Addon", title: "Addon"},
  { value: "Framework :: Plone :: Theme", title: "Theme"},
  { value: "Framework :: Plone :: Distribution", title: "Distribution"},
  { value: "Framework :: Plone :: Core", title: "Core"}
];

export const sort_options = [
  { value: 'name_sortable:asc', title: 'Title A-Z' },
  { value: 'name_sortable:desc', title: 'Title Z-A' },
  { value: 'upload_timestamp:desc', title: 'Last Modified' }
];

export const default_sort = 'name_sortable:asc';

// if (process.env.isProd) {
//   api_url = "https://addons.plone.org/api";
// } else {
//   api_url = "http://localhost:8108";
// }
