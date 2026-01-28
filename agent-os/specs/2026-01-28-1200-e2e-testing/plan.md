# Live Search Bug Fix and E2E Test Plan

## Summary

Fix the UI flashing bug when typing in the search input and add comprehensive E2E tests for live search functionality.

**Problem:** When typing in the search input, the UI flashes after every letter and the search form appears empty. This is caused by a race condition between the debounced URL update (300ms) and the navigation detection effect.

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-01-28-1200-e2e-testing/` with:
- `plan.md` - This full plan
- `shape.md` - Shaping notes (scope, decisions, context)
- `standards.md` - Relevant standards that apply
- `references.md` - Pointers to reference implementations

---

## Task 2: Write E2E Test (TDD - Test First)

**File:** `tests/e2e/live-search.spec.ts`

Create test cases:
1. **Input persistence** - Search input value persists during character-by-character typing
2. **No flash during debounce** - Input does not flash/clear during 300ms debounce period
3. **URL updates after debounce** - URL contains search term after debounce completes
4. **Results update** - Search results update after typing completes
5. **No duplicate URL updates** - Rapid typing causes only one URL update
6. **Browser back** - Restores previous search state
7. **Browser forward** - Restores next search state

**File:** `tests/e2e/fixtures.ts` - Add helper methods:
- `typeSlowly(term, delayMs)` - Type character by character
- `getInputValueDuringDebounce(checks)` - Sample input value during debounce

---

## Task 3: Fix Race Condition in SearchForm.svelte

**File:** `src/lib/SearchForm.svelte`

### Root Cause
Lines 95-156: Navigation effect compares current state with URL and resets `term` during debounce window before URL has updated.

### Fix Strategy
Add `isUserTyping` flag to prevent navigation effect from interfering during active input.

### Changes

1. **Add state variable** (after line 32):
```typescript
let isUserTyping = $state(false);
```

2. **Modify debounce effect** (lines 199-219):
- Set `isUserTyping = true` when term changes
- Clear flag after URL update completes with small delay

3. **Guard navigation effect** (line 96):
- Add early return: `if (isUserTyping) return;`

---

## Task 4: Run Tests and Verify

1. Run new tests: `pnpm test:e2e tests/e2e/live-search.spec.ts`
2. Run full suite: `pnpm test:e2e`
3. Manual verification in browser

---

## Critical Files

| File | Action |
|------|--------|
| `src/lib/SearchForm.svelte` | Modify - add `isUserTyping` flag and guards |
| `tests/e2e/live-search.spec.ts` | Create - new E2E test file |
| `tests/e2e/fixtures.ts` | Modify - add helper methods |

---

## Standards Applied

- **testing/test-writing** - TDD approach, write test before fix
- **svelte/runes** - Proper use of $state and $effect
