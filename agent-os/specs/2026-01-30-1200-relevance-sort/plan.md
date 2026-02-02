# Add "By Relevance" Sort Option for Search Results

## Overview
Add a "By Relevance" option to the sort dropdown that appears only when there's an active search term.

## Implementation Tasks

1. **settings.ts**: Add `relevance_sort_option` constant
2. **search.ts**: Update sortBy logic to handle pure relevance sorting
3. **PackageList.svelte**: Show and auto select `by relevance` option conditionally based on search term
4. **SearchForm.svelte**: Validate URL params - fallback if relevance sort without search

## Behavior
- "By Relevance" only visible and active when user has entered a search term (not `*` or empty)
- Automatically selected when searching with a term
- don't store `be relevance` in local storage, having it in the url after selecting (auto selecting) it is good though
- When selected, sort purely by `_text_match:desc`
- When search term is cleared, fallback to default sort if relevance was selected

## E2E Test Coverage
- `sorting.spec.ts`: Added test for auto-selection of "By Relevance" when searching
  - Verifies default is A-Z
  - Enters search term "plone"
  - Verifies relevance sort auto-selected
  - Verifies user can manually switch to different sort

## Improved Relevance Sorting (Phase 2)

### Search Field Weights
| Field | Weight | Rationale |
|-------|--------|-----------|
| name | 80 | Package name matches are most important |
| title | 80 | Title matches equally important |
| summary | 70 | Brief description, highly relevant |
| keywords | 60 | Explicit package tags |
| first_chapter | 40 | Documentation intro |
| main_content | 30 | Full documentation |
| changelog | 1 | Historical info, least relevant |

### Freshness Boost
- Pure relevance mode: `_text_match:desc` only (no freshness boost)
  - Ensures weighted field scores are respected without override
  - Packages matching in higher-weighted fields (name, title) rank above those matching in lower-weighted fields
- Other sort modes with search term: `_text_match:desc,{sort},upload_timestamp:desc`
  - Relevance prepended to maintain match quality
  - Freshness as final tiebreaker

### Additional E2E Tests
- `Relevance Sorting Quality` test block:
  - Verifies exact name matches appear first
  - Verifies relevant results rank above irrelevant ones

