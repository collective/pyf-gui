<script lang="ts">
  import { doSearch, resetPagination } from "./search";
  import { package_types, PRIMARY_PLONE_VERSION_THRESHOLD } from "./settings";
  import { default_plone_versions } from "./settings";
  import { default_package_types } from "./settings";
  import { plone_versions, search_term, search_filter, search_sort, sort_initialized } from "$lib/stores";
  import { loadFilterSettings, saveFilterSettings } from "$lib/localStorage";
  import { onMount } from "svelte";
  import type { Filter } from "$lib/interfaces";

  let term = $state("");
  let showPloneVersionsFilter = $state(true);
  let pVersions = $state<string[]>([...default_plone_versions]);
  let pTypes = $state<string[]>([...default_package_types]);
  let isInitialized = $state(false);

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
    $plone_versions.filter(v => {
      if (!v.value.startsWith("Plone")) return false;
      const vNum = getVersionNumber(v.value);
      return vNum >= parseFloat(PRIMARY_PLONE_VERSION_THRESHOLD);
    })
  );

  let olderVersions = $derived(
    $plone_versions.filter(v => {
      if (!v.value.startsWith("Plone")) return false;
      const vNum = getVersionNumber(v.value);
      return vNum < parseFloat(PRIMARY_PLONE_VERSION_THRESHOLD);
    })
  );

  // Load saved filter settings on mount (client-side only)
  onMount(() => {
    const savedSettings = loadFilterSettings();
    pVersions = savedSettings.ploneVersions;
    pTypes = savedSettings.packageTypes;
    isInitialized = true;
  });

  let filter = $derived<Filter>({
    plone_versions: pVersions,
    package_types: pTypes,
  });

  // Save filter settings when they change (after initialization)
  $effect(() => {
    if (isInitialized) {
      saveFilterSettings(pVersions, pTypes);
    }
  });

  // Track sort changes reactively using store subscription
  $effect(() => {
    // Wait for sort to be initialized before searching
    if (!$sort_initialized) {
      return;
    }

    // Update stores for other components to access
    search_term.set(term);
    search_filter.set(filter);
    // Read sort value reactively ($ prefix makes it a dependency)
    const sort = $search_sort;
    // Reset pagination and perform new search
    resetPagination();
    doSearch(term, filter, 1, false, sort);
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    resetPagination();
    doSearch(term, filter, 1, false, $search_sort);
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
        placeholder="Enter add-on name"
        spellcheck="false"
        name="text"
        bind:value={term}
      />
    </div>
    <div class="search-form__filters">
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
                bind:group={pVersions}
                checked={pVersions.includes(version.value)}
                class="form-check-input"
                type="checkbox"
                id="plone_version_{version.value}"
                value={version.value}
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
                    bind:group={pVersions}
                    checked={pVersions.includes(version.value)}
                    class="form-check-input"
                    type="checkbox"
                    id="plone_version_{version.value}"
                    value={version.value}
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
                bind:group={pTypes}
                checked={pTypes.includes(ptype.value)}
                class="form-check-input"
                type="checkbox"
                id="package_type_{ptype.value}"
                value={ptype.value}
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
                    bind:group={pTypes}
                    checked={pTypes.includes(ptype.value)}
                    class="form-check-input"
                    type="checkbox"
                    id="package_type_{ptype.value}"
                    value={ptype.value}
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
