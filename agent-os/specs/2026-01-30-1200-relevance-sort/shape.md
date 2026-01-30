# Shape: By Relevance Sort Option

## Component Changes

### settings.ts
- Add `relevance_sort_option` constant: `{ value: '_text_match:desc', title: 'By Relevance' }`

### search.ts
- Modify sortBy construction:
  - If sort is `_text_match:desc`: use only `_text_match:desc`
  - Else if search term active: prepend `_text_match:desc` to sort
  - Else: use sort + `upload_timestamp:desc`

### PackageList.svelte
- Import `relevance_sort_option` from settings
- Derive `hasActiveSearch` from `search_term` store
- Derive `availableSortOptions` - includes relevance when searching
- Add effect to fallback sort when relevance becomes unavailable
- Update dropdown to use `availableSortOptions`

### SearchForm.svelte
- Validate URL sort param - if `_text_match:desc` without search term, reset to default
