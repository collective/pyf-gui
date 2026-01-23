# Utility Functions

Shared formatting and parsing functions live in `src/lib/utils.ts`.

```typescript
// Naming: verb + noun (getPloneVersions, formatNumber, toLocalizedTime)
export function getPloneVersions(classifiers: string[]): string[] { ... }
export function formatNumber(num: number | undefined): string { ... }
export function toLocalizedTime(uts: number): string { ... }
```

- Start in `utils.ts`, split into domain files when it grows large
- Export individual functions, not a default object
- Use TypeScript types for parameters and return values
- Keep functions pure when possible (no side effects)
