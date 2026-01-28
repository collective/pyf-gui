# E2E Testing Standards Applied

## From testing/test-writing.md

### Test Only Core User Flows
- Focus on the happy path for each feature
- Don't test edge cases in E2E (unit tests are better for that)
- Test what users actually do

### Test Behavior, Not Implementation
- Tests should survive refactoring
- Use user-facing selectors (text, role, visible classes)
- Don't test internal state directly

### Clear Test Names
- Describe what is being tested
- Format: `action + expected result`
- Example: `displays Plone versions sorted newest first`

### E2E with Playwright
- Use for critical user journeys
- Run against production build
- Keep tests independent and parallelizable

## Additional Standards

### Page Object Pattern
- Encapsulate page interactions in fixtures
- Reusable methods for common actions
- Single place to update selectors

### Assertion Best Practices
- Use Playwright's auto-waiting assertions
- Be specific about what to check
- Avoid brittle timing-based waits

### Test Organization
- One file per feature/spec
- Group related tests with describe blocks
- Clear separation between setup and assertions
