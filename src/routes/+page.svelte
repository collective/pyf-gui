<script lang="ts">
  import PackageList from "$lib/PackageList.svelte";
  import SearchForm from "$lib/SearchForm.svelte";

  let filtersExpanded = $state(false);

  function toggleFilters() {
    filtersExpanded = !filtersExpanded;
  }
</script>

<button
  class="filter-toggle"
  onclick={toggleFilters}
  aria-expanded={filtersExpanded}
  aria-controls="filters-panel"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="filter-toggle__icon" viewBox="0 0 16 16">
    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
  </svg>
  <span class="filter-toggle__label">Filters</span>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="filter-toggle__chevron" viewBox="0 0 16 16">
    {#if filtersExpanded}
      <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
    {:else}
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    {/if}
  </svg>
</button>

<aside id="filters-panel" class:expanded={filtersExpanded}>
  <SearchForm />
</aside>

<article>
  <PackageList />
</article>

<style lang="scss">
  /* Mobile-first: filter toggle visible by default */
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
    width: 100%;
    padding: var(--spacing-md, 1rem) var(--spacing-sm, 0.5rem);
    background: var(--color-secondary, #fffdda);
    border: none;
    border-bottom: 2px solid var(--color-border, #d3d3d3);
    cursor: pointer;
    font-family: var(--font-family-base, inherit);
    font-size: var(--font-size-base, 1rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text, #333);
    transition: background-color 0.2s;

    &:hover {
      background: var(--color-secondary, #fffdda);
    }

    &:focus {
      outline: 2px solid var(--color-primary, #0095d3);
      outline-offset: -2px;
    }

    &__icon {
      flex-shrink: 0;
      color: var(--color-primary, #0095d3);
    }

    &__label {
      flex-grow: 1;
      text-align: left;
    }

    &__chevron {
      flex-shrink: 0;
    }
  }

  /* Mobile-first: sidebar collapsed by default */
  aside {
    display: none;
    padding: var(--spacing-md, 1rem) var(--spacing-sm, 0.5rem);
    background: var(--color-background, #fff);
    border-bottom: 2px solid var(--color-border, #d3d3d3);

    &.expanded {
      display: block;
    }
  }

  article {
    padding: 0 var(--spacing-sm, 0.5rem) var(--spacing-xl, 2rem);
  }

  /* Desktop: grid layout, sidebar always visible */
  @media (min-width: 640px) {
    .filter-toggle {
      display: none;
    }

    aside {
      display: block;
      grid-area: sidebar;
      padding: min(1em, 1vh) 0.5em min(1em, 2vh) 0.5em;
      max-width: 28ch;
      border-bottom: none;
    }

    article {
      grid-area: content;
      padding: 0 var(--spacing-md, 1rem) var(--spacing-lg, 1.5rem);
    }
  }
</style>
