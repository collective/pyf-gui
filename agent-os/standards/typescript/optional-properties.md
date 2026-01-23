# Optional Properties

Use optional properties (`?`) for fields that may be undefined.

```typescript
export interface Package {
  name: string;           // Required: always present
  version: string;        // Required: always present

  summary?: string;       // Optional: may be missing from API
  github_stars?: number;  // Optional: not all packages have GitHub
  download_total?: number; // Optional: stats may not be available
}
```

**In templates, guard optional values:**
```svelte
{#if item.github_stars != undefined}
  <span>{item.github_stars}</span>
{/if}
```

- Required: core identifiers (name, version, id)
- Optional: external data (GitHub stats, download counts)
- Optional: fields that enable graceful degradation
