<script lang="ts">
  import { doSearch } from "./search";
  import { package_types } from "./settings";
  import { default_plone_versions } from "./settings";
  import { default_package_types } from "./settings";
  import { plone_versions } from "$lib/stores";
  import type { Filter } from "$lib/interfaces";

  let term = $state("");
  let showPloneVersionsFilter = $state(true);
  let pVersions = $state<string[]>([...default_plone_versions]);
  let pTypes = $state<string[]>([...default_package_types]);

  let filter = $derived<Filter>({
    plone_versions: pVersions,
    package_types: pTypes,
  });

  $effect(() => {
    doSearch(term, filter);
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    doSearch(term, filter);
  }

  function togglePloneVersionsFilter() {
    showPloneVersionsFilter = !showPloneVersionsFilter;
  }
</script>

<div class="search_form">
  <form onsubmit={handleSubmit}>
    <div class="field search">
      <div class="label">Search</div>
      <input
        type="text"
        placeholder="Enter add-on name"
        spellcheck="false"
        name="text"
        bind:value={term}
      />
    </div>
    <div class="filters">
      <div class="field plone_version">
        <button
          type="button"
          class="label clickable"
          onclick={togglePloneVersionsFilter}
          aria-expanded={showPloneVersionsFilter}
          aria-controls="plone-versions-filter"
        >
          Plone versions {#if !showPloneVersionsFilter}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
          {/if}{#if showPloneVersionsFilter}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
          </svg>
          {/if}
        </button>
        <div id="plone-versions-filter" class="filter-grid {showPloneVersionsFilter ? 'show' : ''}">
          {#each $plone_versions as version, i}
            {#if version.value.startsWith("Plone")}
              <div class="form-check form-switch">
                <input
                  bind:group={pVersions}
                  class="form-check-input"
                  type="checkbox"
                  id="plone_version_{i}"
                  value={version.value}
                />
                <label class="form-check-label" for="plone_version_{i}">
                  {version.value.replace("Plone ", "")} ({version.count})
                </label>
              </div>
            {/if}
          {/each}
        </div>
      </div>
      <div class="field package_types">
        <label for="package_type">Add-on types</label>
        <div class="filter-grid">
          {#each package_types as ptype, i}
            <div class="form-check form-switch">
              <input
                bind:group={pTypes}
                class="form-check-input"
                type="checkbox"
                id="package_type_{i}"
                value={ptype.value}
              />
              <label class="form-check-label" for="package_type_{i}">
                {ptype.title}
              </label>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </form>
</div>

<style lang="scss">
  label,
  .label {
    display: block;
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    padding: min(0.5em, 1vh) 0 min(0.5vh, 0.1em) 0;
    margin: min(0.5em, 1vh) 0 min(0.5vh, 0.8em) 0;
  }
  .clickable{
    cursor: pointer;
    background: none;
    border: none;
    text-align: left;
    width: 100%;
  }
  .field {
    border-bottom: 2px solid #d3d3d3;
    padding: 0.2em 0 min(2.2em, 3vh) 0;
  }
  #plone-versions-filter{
    display: none;
    &.show{
      display: grid;
    }
  }

  // Grid container for filter switches
  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: 0.5rem 1rem;
    align-items: center;
  }

  // Override Bootstrap form-check for grid alignment
  .filter-grid :global(.form-check) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.4rem;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .filter-grid :global(.form-check-input) {
    margin: 0;
  }

  .filter-grid :global(.form-check-label) {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }
  form {
    .search{
      input{
        min-width: 100%;
      }
    }
  }
</style>
