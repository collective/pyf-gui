# pyf-gui

A SvelteKit UI for the Plone Add-on Gallery (PAG).

Requires [pyf.aggregator](https://github.com/collective/pyf.aggregator) and a Typesense instance to work.

## Features

- Search and browse Plone packages with faceted filtering
- Filter by Plone version and package type (Addon, Theme, Distribution, Core)
- Sort results by title or last modified date
- Infinite scroll for seamless browsing
- **Persistent user preferences** - filter and sort settings are saved to localStorage
- **Mobile-first responsive design** - collapsible filter panel on mobile, always-visible sidebar on desktop
- **Progressive disclosure** - primary filters shown by default, older versions and specialized types behind "more" toggles
- **Modern CSS architecture** - CSS layers for clean cascade control, design tokens for consistent theming

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

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
