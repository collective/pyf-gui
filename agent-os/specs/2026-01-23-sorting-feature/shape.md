# Shape: Sorting Feature

## Problem Statement
Users browsing the Plone Add-on Gallery need the ability to sort search results by different criteria (alphabetically, by modification date) to find packages more efficiently.

## Solution
Add a Bootstrap select dropdown above the results count that allows users to choose between sorting options. The sort selection triggers a new search with the appropriate Typesense `sort_by` parameter.

## Key Decisions

1. **UI Placement**: Sort dropdown placed in results header, next to results count, using flexbox layout
2. **Sort Options**: Three options covering alphabetical (A-Z, Z-A) and temporal (Last Modified) sorting
3. **Relevance Preservation**: When search term is present, `_text_match:desc` is prepended to maintain relevance-based ordering
4. **Store-based State**: Sort selection stored in Svelte writable store for reactive updates across components

## Trade-offs

- **Simplicity over configurability**: Fixed set of 3 sort options rather than fully customizable
- **Client-side state**: Sort preference not persisted to URL or localStorage (could be added later)
