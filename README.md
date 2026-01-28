# pyf-gui

A SvelteKit UI for the Plone Add-on Gallery (PAG).

Requires [pyf.aggregator](https://github.com/collective/pyf.aggregator) and a Typesense instance to work.

## Features

- Search and browse Plone packages with faceted filtering
- Filter by Plone version and package type (Addon, Theme, Distribution, Core)
- Sort results by title or last modified date
- Infinite scroll for seamless browsing
- **Shareable URLs** - search state is synchronized to URL parameters for bookmarking and sharing
- **Persistent user preferences** - filter and sort settings are saved to localStorage
- **Mobile-first responsive design** - collapsible filter panel on mobile, always-visible sidebar on desktop
- **Progressive disclosure** - primary filters shown by default, older versions and specialized types behind "more" toggles
- **Modern CSS architecture** - CSS layers for clean cascade control, design tokens for consistent theming

## URL Parameters

The app supports shareable URLs with search state:

| Param | Format | Example |
|-------|--------|---------|
| `q` | search term | `q=collective` |
| `version` | comma-separated | `version=6.1,6.0` |
| `type` | short codes | `type=addon,theme` |
| `sort` | field:direction | `sort=upload_timestamp:desc` |

**Type codes:** `addon`, `theme`, `core`, `distribution`

**Example URLs:**
- `/?q=collective&version=6.1,6.0&type=addon`
- `/?version=6.0,5.2` (uses defaults for q and type)

**Priority order:** URL params > localStorage > defaults

## User Preferences

The app remembers your filter and sort selections across sessions:

| Setting | localStorage Key | Default |
|---------|------------------|---------|
| Plone Versions | `pyf_plone_versions` | `["Plone 6.1", "Plone 6.0", "Plone 5.2"]` |
| Package Types | `pyf_package_types` | `["Framework :: Plone :: Addon"]` |
| Sort Order | `pyf_sort` | `"name_sortable:asc"` |

To reset to defaults, clear the `pyf_*` keys from localStorage in your browser's DevTools.

## Developing

Install dependencies and start a development server:

```bash
pnpm install
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Testing

### E2E Tests with Playwright

The project includes comprehensive end-to-end tests using Playwright.

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run with UI mode for debugging and watching tests
pnpm test:e2e:ui

# Run only desktop Chrome tests
pnpm test:e2e --project=chromium

# Run only mobile tests
pnpm test:e2e --project=mobile

# Run in headed mode (watch the browser)
pnpm test:e2e --headed

# Run in presenter mode (slow, sequential, headed - great for demos)
pnpm test:e2e:presenter

# Run a specific test file
pnpm test:e2e tests/e2e/sorting.spec.ts

# Run tests matching a pattern
pnpm test:e2e --grep "loads sort"
```

**Presenter mode** runs tests in a way that's easy to follow visually:
- Browser opens in headed mode at 1920x1080
- Tests run sequentially (single worker)
- 500ms delay between each action
- Only runs desktop Chrome (reduces repetition)

Test coverage includes:
- **Version Display** - version sorting, fade effects, tooltips, download formatting
- **Sorting** - default sort, URL-based sorting, localStorage persistence
- **Mobile Responsive** - filter toggle, sidebar collapse/expand, progressive disclosure
- **URL Parameters** - state loading from URL, clean URLs, localStorage override
- **Static Pages** - about/help pages, navigation

**First run setup:**
```bash
# Install Playwright browsers (needed once)
pnpm exec playwright install chromium
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
