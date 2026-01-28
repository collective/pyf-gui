# Component References for Test Selectors

## Key Selectors (from code review)

| Element | Selector | Component |
|---------|----------|-----------|
| Search input | `.search-form__input` | SearchForm.svelte |
| Sort select | `#sort-select` | +page.svelte |
| Filter toggle | `.filter-toggle` | +page.svelte |
| Filters panel | `aside#filters-panel` | +page.svelte |
| Package card | `.package-card` | PackageItem.svelte |
| Results count | `.results-header__count` | +page.svelte |
| More versions toggle | `.search-form__more-toggle` | SearchForm.svelte |
| Version list (in card) | `.package-card__plone-versions ul` | PackageItem.svelte |
| Downloads | `.package-card__downloads` | PackageItem.svelte |

## URL Parameters

| Parameter | Purpose | Default |
|-----------|---------|---------|
| `q` | Search term | (empty) |
| `version` | Plone version filter | all selected |
| `sort` | Sort order | `name_sortable:asc` |

## Sort Options

| Value | Label |
|-------|-------|
| `name_sortable:asc` | A-Z |
| `name_sortable:desc` | Z-A |
| `upload_timestamp:desc` | Last Modified |

## Plone Versions (descending order expected)

- 6.1
- 6.0
- 5.2
- 5.1
- 5.0
- 4.3

## Static Routes

| Route | Purpose |
|-------|---------|
| `/` | Main search page |
| `/about` | About page |
| `/help` | Help page |
| `/project/[name]` | Package detail |
