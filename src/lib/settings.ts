// export let api_url:string;

export const default_plone_versions = [
  "Plone 6.0",
  "Plone 5.2"
];

export const default_package_types = [
  "Framework :: Plone :: Addon",
  "Framework :: Plone :: Theme",
  "Framework :: Plone :: Distribution"
];

export const package_types = [
  { value: "Framework :: Plone :: Addon", title: "Addon"},
  { value: "Framework :: Plone :: Theme", title: "Theme"},
  { value: "Framework :: Plone :: Distribution", title: "Distribution"},
  { value: "Framework :: Plone :: Core", title: "Core"}
];

// if (process.env.isProd) {
//   api_url = "https://addons.plone.org/api";
// } else {
//   api_url = "http://localhost:8108";
// }
