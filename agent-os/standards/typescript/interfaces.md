# Domain Interfaces

Define TypeScript interfaces co-located with their usage.

```typescript
// src/lib/interfaces.ts - shared domain types
export interface Package {
  name: string;
  version: string;
  summary?: string;
}

export interface Filter {
  plone_versions: string[];
  package_types: string[];
}
```

- Co-locate types with the code that uses them
- Use `interface` for object shapes, `type` for unions/aliases
- Export all interfaces for reuse across components
- Name interfaces as nouns: `Package`, `Filter`, `VersionInfo`
