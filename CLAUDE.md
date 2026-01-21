# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pyf-gui is a SvelteKit-based web UI for browsing the Plone Add-on Gallery (PAG). It searches and displays Plone packages using Typesense as the search backend, with data provided by pyf.aggregator.

## Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Type checking
pnpm run check
pnpm run check:watch    # watch mode

# Production build (outputs to build/)
pnpm run build

# Preview production build
pnpm run preview
```

## Architecture

### Stack
- **SvelteKit** with TypeScript
- **Typesense** for search (client-side queries)
- **Bootstrap 5** with SCSS customization
- **mdsvex** for Markdown support in routes

### Environment Variables
The app requires these `PUBLIC_*` env vars for Typesense configuration (set in `.env`):
- `PUBLIC_SEARCH_PROTOCOL` (http/https)
- `PUBLIC_SEARCH_HOST`
- `PUBLIC_SEARCH_PORT`
- `PUBLIC_SEARCH_API_KEY`

### Route Structure
- `/` - Main search page with sidebar filters and package list
- `/project/[name]` - Individual package detail page
- `/about`, `/help` - Static info pages

### Key Modules (`src/lib/`)
- `search.ts` - Typesense client initialization and `doSearch()` function for multi-search queries with facets
- `stores.ts` - Svelte writable stores: `package_list`, `plone_versions`, `search_term`, `search_filter`
- `settings.ts` - Default filter values and package type classifiers
- `interfaces.ts` - TypeScript interfaces (`Filter`, `VersionInfo`)
- `SearchForm.svelte` - Filter UI component
- `PackageList.svelte` / `PackageItem.svelte` - Results display components

### Styling
- Global styles in `src/app.scss`
- Bootstrap variables overridden in `src/variables.scss` (Plone blue: `#0095d3`)
- Components use scoped `<style lang="scss">` blocks
- CSS Grid layout: header, sidebar, content, footer areas

### Data Flow
1. User enters search term or selects filters in `SearchForm`
2. `doSearch()` in `search.ts` builds Typesense filter strings and executes multi-search
3. Results update Svelte stores (`package_list`, `plone_versions`)
4. `PackageList` reactively displays results grouped by package name


# Rules

- no claude code in commit messages
