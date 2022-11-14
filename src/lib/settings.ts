// export let api_url:string;

export const plone_versions = [
  { value: "", title: "All"},
  { value: "Framework :: Plone :: 6.0", title: "6.0" },
  { value: "Framework :: Plone :: 5.2", title: "5.2" },
  { value: "Framework :: Plone :: 5.1", title: "5.1" },
  { value: "Framework :: Plone :: 5.0", title: "5.0" },
  { value: "Framework :: Plone :: 4.3", title: "4.3" }
];

export const package_types = [
  { value: "", title: "All"},
  { value: "Framework :: Plone :: Addon", title: "Addon"},
  { value: "Framework :: Plone :: Theme", title: "Theme" },
  { value: "Framework :: Plone :: Core", title: "Core" }
];

// if (process.env.isProd) {
//   api_url = "https://addons.plone.org/api";
// } else {
//   api_url = "http://localhost:8108";
// }
