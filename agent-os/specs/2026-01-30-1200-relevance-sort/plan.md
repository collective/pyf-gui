# Add "By Relevance" Sort Option for Search Results

## Overview
Add a "By Relevance" option to the sort dropdown that appears only when there's an active search term.

## Implementation Tasks

1. **settings.ts**: Add `relevance_sort_option` constant
2. **search.ts**: Update sortBy logic to handle pure relevance sorting
3. **PackageList.svelte**: Show relevance option conditionally based on search term
4. **SearchForm.svelte**: Validate URL params - fallback if relevance sort without search

## Behavior
- "By Relevance" only visible when user has entered a search term (not `*` or empty)
- User must manually select it (no auto-switching)
- When selected, sort purely by `_text_match:desc`
- When search term is cleared, fallback to default sort if relevance was selected
