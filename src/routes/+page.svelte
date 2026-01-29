<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import PackageList from "$lib/PackageList.svelte";
  import SearchForm from "$lib/SearchForm.svelte";
  import { pageState } from '$lib/page-state.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  onMount(() => {
    pageState.showMobileFilter = true;
  });

  onDestroy(() => {
    pageState.showMobileFilter = false;
    pageState.filtersExpanded = false;
  });
</script>

<aside id="filters-panel" class:expanded={pageState.filtersExpanded}>
  <SearchForm urlParams={data.urlParams} urlHasParams={data.urlHasParams} />
</aside>

<article>
  <PackageList />
</article>

<style lang="scss">
  /* Mobile-first: sidebar collapsed by default */
  aside {
    display: none;
    padding: var(--spacing-md, 1rem) var(--spacing-sm, 0.5rem);
    background: var(--color-background, #fff);
    border-bottom: 2px solid var(--color-border, #d3d3d3);

    /* Hide search field on mobile - it's in the header */
    :global(.search-form__field--search) {
      display: none;
    }

    &.expanded {
      display: block;
      background: var(--color-primary, #0095d3);
      border-bottom: none;

      /* White text for all elements inside */
      color: #fff;
      --color-text: #fff;
      --color-text-muted: rgba(255, 255, 255, 0.8);
      --color-border: transparent;
    }

    /* Remove borders from search-form fields on mobile when expanded */
    &.expanded :global(.search-form__field) {
      border-bottom: none;
    }

    /* Fix more-toggle button visibility on mobile expanded */
    &.expanded :global(.search-form__more-toggle) {
      background: #fff;
      color: var(--color-primary, #0095d3);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  article {
    padding: 0 var(--spacing-sm, 0.5rem) var(--spacing-xl, 2rem);
  }

  /* Desktop: grid layout, sidebar always visible */
  @media (min-width: 640px) {
    aside {
      display: block;
      grid-area: sidebar;
      padding: var(--spacing-md, 1rem) 0.5em min(1em, 2vh) 0.5em;
      max-width: 28ch;
      border-bottom: none;

      /* Show search field on desktop */
      :global(.search-form__field--search) {
        display: block;
      }
    }

    article {
      grid-area: content;
      padding: 0 0 var(--spacing-md, 1rem) var(--spacing-lg, 1.5rem);
    }
  }
</style>
