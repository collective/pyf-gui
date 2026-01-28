# Changelog

## 1.0a1 (unreleased)

- Add Playwright E2E test suite covering version display, sorting, mobile responsive, URL params, and static pages
- Add URL parameter synchronization for shareable search links (q, version, type, sort params)
- Fix version sorting to always show the latest package version (use upload_timestamp instead of lexicographic version_sortable)
- Add "Sort by" label to the sorting dropdown for better UX and accessibility
- Fix default filter checkboxes not being checked on page load (Svelte 5 bind:group reactivity issue)
- Add mobile-first responsive layout with collapsible filter panel
- Add progressive disclosure for filters (older Plone versions and specialized package types behind "more" toggles)
- Modernize CSS architecture with CSS layers (@layer) and design tokens (CSS custom properties)
- Convert component styles to BEM naming convention
- Add comprehensive CSS Layers documentation for whitelabeling support
- Initial release
- Search and browse Plone packages with Typesense backend
- Filter by Plone version and package type (Addon, Theme, Distribution, Core)
- Sort results by title or last modified date
- Infinite scroll for seamless browsing
- Persistent user preferences via localStorage
- Package detail pages with metadata, GitHub stats, and version info
- Link version badges and download stats to PyPI
