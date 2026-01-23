# Settings Constants

Static configuration lives in `src/lib/settings.ts`.

```typescript
// Default filter values
export const default_plone_versions = [
  "Plone 6.1",
  "Plone 6.0",
  "Plone 5.2"
];

// UI option definitions
export const package_types = [
  { value: "Framework :: Plone :: Addon", title: "Addon" },
  { value: "Framework :: Plone :: Theme", title: "Theme" },
];
```

- Use `settings.ts` for static config that doesn't change per environment
- Use environment variables (`PUBLIC_*`) for secrets and env-specific values
- Export as `const` for arrays, typed objects for structured config
- Name with `default_` prefix for initial/fallback values
