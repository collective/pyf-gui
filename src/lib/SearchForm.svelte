<script lang="ts">
  import { browser } from "$app/environment";
  import { goto, afterNavigate } from "$app/navigation";
  import { loadFilterSettings, loadSortSetting, saveFilterSettings, loadLanguageSetting, saveLanguageSetting } from "$lib/localStorage";
  import { pageState } from "$lib/page-state.svelte";
  import { searchState, getFilter, registerSearchInputHandler } from "$lib/search-state.svelte";
  import { buildUrlString, serializeToUrl, type UrlSearchState } from "$lib/urlParams";
  import { onMount } from "svelte";
  import { doSearch, resetPagination, fetchInitialFacets } from "./search";
  import { default_package_types, default_plone_versions, default_sort, package_types, PRIMARY_PLONE_VERSION_THRESHOLD, relevance_sort_option, language_options } from "./settings";

  // Props from load function
  interface Props {
    urlParams: UrlSearchState;
    urlHasParams: boolean;
  }
  let { urlParams, urlHasParams }: Props = $props();

  let showPloneVersionsFilter = $state(true);

  // Derived: show Python-specific filters only when Python is selected
  let showPythonFilters = $derived(searchState.language === 'python');

  // Debounce timer for search term
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Track whether the previous search term was active (for auto-relevance selection)
  let lastSearchTermWasActive = false;

  // Track if we initialized from URL params (to prevent auto-relevance override)
  let initializedFromUrl = false;

  // Progressive disclosure states
  let showOlderVersions = $state(false);
  let showMoreTypes = $state(false);

  // Derived: split package types into primary and secondary
  let primaryTypes = $derived(package_types.filter(t => t.primary));
  let secondaryTypes = $derived(package_types.filter(t => !t.primary));

  // Helper to extract version number from "Plone X.Y" format
  function getVersionNumber(versionString: string): number {
    const match = versionString.match(/Plone\s+(\d+\.?\d*)/);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
  }

  // Derived: split Plone versions into primary (>= 5.2) and older (< 5.2)
  let primaryVersions = $derived(
    searchState.ploneVersionsAvailable.filter(v => {
      if (!v.value.startsWith("Plone")) return false;
      const vNum = getVersionNumber(v.value);
      return vNum >= parseFloat(PRIMARY_PLONE_VERSION_THRESHOLD);
    })
  );

  let olderVersions = $derived(
    searchState.ploneVersionsAvailable.filter(v => {
      if (!v.value.startsWith("Plone")) return false;
      const vNum = getVersionNumber(v.value);
      return vNum < parseFloat(PRIMARY_PLONE_VERSION_THRESHOLD);
    })
  );

  // Update URL when state changes
  function updateUrl() {
    if (!browser || !searchState.initialized) return;

    const state: UrlSearchState = {
      searchTerm: searchState.term || '*',
      ploneVersions: searchState.ploneVersions,
      packageTypes: searchState.packageTypes,
      sort: searchState.sort,
      language: searchState.language,
      hasExplicitSort: true
    };

    const params = serializeToUrl(state);
    const urlString = buildUrlString(params);
    const targetUrl = urlString || '/';

    // Don't navigate if URL hasn't changed
    const currentPath = window.location.pathname + window.location.search;
    const normalizedTarget = targetUrl.startsWith('?') ? '/' + targetUrl : targetUrl;
    if (normalizedTarget === currentPath) return;

    goto(targetUrl, { keepFocus: true, noScroll: true });
  }

  // Central search trigger
  function triggerSearch() {
    resetPagination();
    doSearch(searchState.term, getFilter(), 1, false, searchState.sort, searchState.language);
  }

  // Input handler with debounce + auto-relevance
  function handleSearchInput() {
    // Sync to pageState for mobile header search
    pageState.searchTerm = searchState.term;

    const isActive = searchState.term !== '' && searchState.term !== '*';

    // Auto-select relevance sort when first typing a search term
    if (isActive && !lastSearchTermWasActive && !initializedFromUrl && !searchState.userSelectedSort) {
      searchState.sort = relevance_sort_option.value;
    }
    // Clear initializedFromUrl flag after first input processing
    if (initializedFromUrl) {
      initializedFromUrl = false;
    }
    // Reset user_selected_sort when search is cleared
    if (!isActive && lastSearchTermWasActive) {
      searchState.userSelectedSort = false;
      // Reset relevance sort when search is cleared
      if (searchState.sort === relevance_sort_option.value) {
        searchState.sort = default_sort;
      }
    }
    lastSearchTermWasActive = isActive;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      updateUrl();
      triggerSearch();
    }, 300);
  }

  // Filter change handler (Plone versions, package types)
  function handleFilterChange() {
    saveFilterSettings(searchState.ploneVersions, searchState.packageTypes);
    updateUrl();
    triggerSearch();
  }

  // Language change handler
  function handleLanguageChange() {
    saveLanguageSetting(searchState.language);
    // Refetch facets when language changes
    fetchInitialFacets(searchState.language);
    updateUrl();
    triggerSearch();
  }

  // Sync state from URL params (used for browser back/forward)
  function syncStateFromUrl(url: URL) {
    const urlQ = url.searchParams.get('q');
    const urlVersion = url.searchParams.get('version');
    const urlType = url.searchParams.get('type');
    const urlSort = url.searchParams.get('sort');
    const urlLang = url.searchParams.get('lang');

    // Update language from URL
    searchState.language = urlLang === 'js' ? 'javascript' : 'python';

    // Update search term
    const newTerm = urlQ || '';
    searchState.term = newTerm;
    pageState.searchTerm = newTerm;

    if (urlVersion !== null) {
      searchState.ploneVersions = urlVersion.split(',').map(v => `Plone ${v.trim()}`);
    } else {
      searchState.ploneVersions = [...default_plone_versions];
    }

    if (urlType !== null) {
      const CODE_TO_TYPE: Record<string, string> = {
        'addon': 'Framework :: Plone :: Addon',
        'theme': 'Framework :: Plone :: Theme',
        'core': 'Framework :: Plone :: Core',
        'distribution': 'Framework :: Plone :: Distribution'
      };
      searchState.packageTypes = urlType.split(',').map(code => CODE_TO_TYPE[code.trim()]).filter(Boolean);
    } else {
      searchState.packageTypes = [...default_package_types];
    }

    // Validate: relevance sort requires active search term
    const hasActiveTerm = newTerm !== '' && newTerm !== '*';
    const isRelevanceSort = urlSort === relevance_sort_option.value;
    if (urlSort !== null && !(isRelevanceSort && !hasActiveTerm)) {
      searchState.sort = urlSort;
    } else if (isRelevanceSort && !hasActiveTerm) {
      searchState.sort = default_sort;
    } else {
      const savedSort = loadSortSetting();
      if (savedSort === relevance_sort_option.value && !hasActiveTerm) {
        searchState.sort = default_sort;
      } else {
        searchState.sort = savedSort;
      }
    }

    // Update tracking state
    lastSearchTermWasActive = hasActiveTerm;
  }

  // Handle browser back/forward navigation
  afterNavigate(({ type }) => {
    if (type === 'popstate' && searchState.initialized) {
      syncStateFromUrl(new URL(window.location.href));
      triggerSearch();
    }
  });

  // Register handler for mobile search input sync
  registerSearchInputHandler(handleSearchInput);

  // Initialize state: URL params > localStorage > defaults
  onMount(async () => {
    // Load language first (affects which facets to fetch)
    if (urlHasParams && urlParams.language) {
      searchState.language = urlParams.language;
    } else {
      searchState.language = loadLanguageSetting();
    }

    // Fetch all available versions immediately for filter display (only for Python)
    await fetchInitialFacets(searchState.language);

    if (urlHasParams) {
      // URL params take priority
      const searchTermFromUrl = urlParams.searchTerm === '*' ? '' : urlParams.searchTerm;
      searchState.term = searchTermFromUrl;
      pageState.searchTerm = searchTermFromUrl;
      searchState.ploneVersions = urlParams.ploneVersions;
      searchState.packageTypes = urlParams.packageTypes;

      const hasActiveSearchTerm = searchTermFromUrl !== '' && searchTermFromUrl !== '*';
      const isRelevanceSort = urlParams.sort === relevance_sort_option.value;

      if (urlParams.hasExplicitSort) {
        initializedFromUrl = true;
        if (hasActiveSearchTerm) {
          lastSearchTermWasActive = true;
        }
      }

      if (isRelevanceSort && !hasActiveSearchTerm) {
        const savedSort = loadSortSetting();
        searchState.sort = savedSort;
      } else if (urlParams.sort !== default_sort) {
        searchState.sort = urlParams.sort;
      } else {
        const savedSort = loadSortSetting();
        searchState.sort = savedSort;
      }
    } else {
      // Fall back to localStorage
      const savedSettings = loadFilterSettings();
      searchState.ploneVersions = savedSettings.ploneVersions;
      searchState.packageTypes = savedSettings.packageTypes;
      const savedSort = loadSortSetting();
      searchState.sort = savedSort;
    }

    searchState.sortInitialized = true;
    searchState.initialized = true;

    // Trigger the initial search
    triggerSearch();
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    triggerSearch();
  }

  function togglePloneVersionsFilter() {
    showPloneVersionsFilter = !showPloneVersionsFilter;
  }

  function toggleOlderVersions() {
    showOlderVersions = !showOlderVersions;
  }

  function toggleMoreTypes() {
    showMoreTypes = !showMoreTypes;
  }
</script>

<div class="search-form">
  <form onsubmit={handleSubmit}>
    <div class="search-form__field search-form__field--search">
      <div class="search-form__label">Search</div>
      <input
        type="text"
        class="search-form__input"
        placeholder={showPythonFilters ? "Enter add-on name" : "Enter package name"}
        spellcheck="false"
        name="text"
        bind:value={searchState.term}
        oninput={handleSearchInput}
      />
    </div>
    <div class="search-form__field search-form__field--language">
      <div class="search-form__label">Language</div>
      <div class="search-form__language-switch">
        {#each language_options as lang}
          <label class="language-option" class:selected={searchState.language === lang.value}>
            <input type="radio" name="language" value={lang.value} bind:group={searchState.language} onchange={handleLanguageChange} />
            <span class="language-option__label">{lang.title}</span>
          </label>
        {/each}
      </div>
    </div>
    <div class="search-form__filters">
      {#if showPythonFilters}
      <div class="search-form__field search-form__field--versions">
        <button
          type="button"
          class="search-form__label search-form__label--clickable"
          onclick={togglePloneVersionsFilter}
          aria-expanded={showPloneVersionsFilter}
          aria-controls="plone-versions-filter"
        >
          Plone versions
          {#if !showPloneVersionsFilter}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="search-form__chevron" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="search-form__chevron" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
            </svg>
          {/if}
        </button>
        <div id="plone-versions-filter" class="search-form__filter-grid {showPloneVersionsFilter ? 'search-form__filter-grid--visible' : ''}">
          {#each primaryVersions as version (version.value)}
            <div class="form-check form-switch">
              <input
                bind:group={searchState.ploneVersions}
                checked={searchState.ploneVersions.includes(version.value)}
                class="form-check-input"
                type="checkbox"
                id="plone_version_{version.value}"
                value={version.value}
                onchange={handleFilterChange}
              />
              <label class="form-check-label" for="plone_version_{version.value}">
                {version.value.replace("Plone ", "")} ({version.count})
              </label>
            </div>
          {/each}

          {#if olderVersions.length > 0}
            <button
              type="button"
              class="search-form__more-toggle"
              onclick={toggleOlderVersions}
              aria-expanded={showOlderVersions}
              title={showOlderVersions ? "Hide older versions" : "Show older versions"}
            >
              <svg viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.5"/>
                <circle cx="8" cy="8" r="1.5"/>
                <circle cx="13" cy="8" r="1.5"/>
              </svg>
            </button>

            {#if showOlderVersions}
              {#each olderVersions as version (version.value)}
                <div class="form-check form-switch">
                  <input
                    bind:group={searchState.ploneVersions}
                    checked={searchState.ploneVersions.includes(version.value)}
                    class="form-check-input"
                    type="checkbox"
                    id="plone_version_{version.value}"
                    value={version.value}
                    onchange={handleFilterChange}
                  />
                  <label class="form-check-label" for="plone_version_{version.value}">
                    {version.value.replace("Plone ", "")} ({version.count})
                  </label>
                </div>
              {/each}
            {/if}
          {/if}
        </div>
      </div>
      <div class="search-form__field search-form__field--types">
        <label class="search-form__label" for="package_type">Add-on types</label>
        <div class="search-form__filter-grid search-form__filter-grid--visible">
          {#each primaryTypes as ptype (ptype.value)}
            <div class="form-check form-switch">
              <input
                bind:group={searchState.packageTypes}
                checked={searchState.packageTypes.includes(ptype.value)}
                class="form-check-input"
                type="checkbox"
                id="package_type_{ptype.value}"
                value={ptype.value}
                onchange={handleFilterChange}
              />
              <label class="form-check-label" for="package_type_{ptype.value}">
                {ptype.title}
              </label>
            </div>
          {/each}

          {#if secondaryTypes.length > 0}
            <button
              type="button"
              class="search-form__more-toggle"
              onclick={toggleMoreTypes}
              aria-expanded={showMoreTypes}
              title={showMoreTypes ? "Hide more types" : "Show more types"}
            >
              <svg viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.5"/>
                <circle cx="8" cy="8" r="1.5"/>
                <circle cx="13" cy="8" r="1.5"/>
              </svg>
            </button>

            {#if showMoreTypes}
              {#each secondaryTypes as ptype (ptype.value)}
                <div class="form-check form-switch">
                  <input
                    bind:group={searchState.packageTypes}
                    checked={searchState.packageTypes.includes(ptype.value)}
                    class="form-check-input"
                    type="checkbox"
                    id="package_type_{ptype.value}"
                    value={ptype.value}
                    onchange={handleFilterChange}
                  />
                  <label class="form-check-label" for="package_type_{ptype.value}">
                    {ptype.title}
                  </label>
                </div>
              {/each}
            {/if}
          {/if}
        </div>
      </div>
      {/if}
    </div>
  </form>
</div>

<style lang="scss">
  .search-form {
    &__label {
      display: block;
      font-size: var(--font-size-base, 1rem);
      font-weight: var(--font-weight-bold, 700);
      color: var(--color-text, #333);
      padding: min(0.5em, 1vh) 0 min(0.5vh, 0.1em) 0;
      margin: min(0.5em, 1vh) 0 min(0.5vh, 0.8em) 0;

      &--clickable {
        cursor: pointer;
        background: none;
        border: none;
        text-align: left;
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm, 0.5rem);
      }
    }

    &__chevron {
      flex-shrink: 0;
    }

    &__field {
      border-bottom: 2px solid var(--color-border, #d3d3d3);
      padding: 0.2em 0 min(2.2em, 3vh) 0;
    }
    &__field:first-child {
      padding-top: 0;
      margin-top: 0;
      .search-form__label{
        padding-top: 0;
        margin-top: 0;
      }
    }

    &__input {
      min-width: 100%;
    }

    &__filter-grid {
      display: none;
      grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
      gap: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
      align-items: center;

      &--visible {
        display: grid;
      }
    }

    &__more-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid var(--color-border, #d3d3d3);
      border-radius: var(--border-radius-sm, 4px);
      background: var(--color-background, #fff);
      color: var(--color-text-muted, #666);
      cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;

      &:hover {
        background: var(--color-secondary, #fffdda);
        border-color: var(--color-primary, #0095d3);
      }

      &:focus {
        outline: 2px solid var(--color-primary, #0095d3);
        outline-offset: 2px;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }

    &__language-switch {
      display: flex;
      gap: var(--spacing-sm, 0.5rem);
    }
  }

  .language-option {
    display: flex;
    align-items: center;
    padding: 0.4em 0.8em;
    border: 1px solid var(--color-border, #d3d3d3);
    border-radius: var(--border-radius-sm, 4px);
    background: var(--color-background, #fff);
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;

    input[type="radio"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    &__label {
      font-size: var(--font-size-sm, 0.9rem);
      font-weight: var(--font-weight-normal, 400);
    }

    &:hover {
      background: var(--color-secondary, #fffdda);
      border-color: var(--color-primary, #0095d3);
    }

    &.selected {
      background: var(--color-primary, #0095d3);
      border-color: var(--color-primary, #0095d3);
      color: #fff;
    }
  }

  /* Override Bootstrap form-check for grid alignment */
  .search-form__filter-grid :global(.form-check) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.4rem;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .search-form__filter-grid :global(.form-check-input) {
    margin: 0;
  }

  .search-form__filter-grid :global(.form-check-label) {
    margin: 0;
    padding: 0;
    font-weight: var(--font-weight-normal, 400);
  }
</style>
