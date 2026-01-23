# Interface Comments

Optionally group interface properties with comments for readability.

```typescript
export interface Package {
  name: string;
  version: string;

  // GitHub stats
  github_url?: string;
  github_stars?: number;
  github_watchers?: number;

  // PyPI download stats
  download_total?: number;
  download_last_month?: number;
}
```

- Optional: use when it improves readability
- Group properties by data source or domain
- Blank line before each section comment
