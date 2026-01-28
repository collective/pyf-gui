# E2E Testing - Shaping Notes

## Decisions Made

### Framework Choice: Playwright
- Native support for SvelteKit
- Built-in mobile emulation for responsive tests
- Excellent selector engine with accessibility support
- Fast parallel execution

### Test Scope
- Focus on core user flows only (no edge cases)
- Test behavior, not implementation details
- Use realistic user interactions (click, type, select)

### Selector Strategy
- Prefer semantic selectors (role, text) where possible
- Use CSS class selectors for specific components
- Avoid data-testid to keep production code clean

### Test Independence
- Each test file can run independently
- No shared state between tests
- Fresh page load for each test

## Trade-offs

### webServer Configuration
Using `pnpm run build && pnpm run preview` ensures tests run against production build.
Trade-off: Slower startup but more realistic testing environment.

### Mobile Testing
Using Playwright's device emulation rather than actual devices.
Trade-off: May miss some real device issues but much faster and more reliable.

### localStorage Testing
Tests verify localStorage behavior but clear it between tests.
Trade-off: Cannot test long-term persistence but ensures test isolation.

## Open Questions

None at this time - plan is ready for implementation.
