<script lang="ts">
  import { package_list, is_loading, has_more, total_found, search_term, search_filter, search_sort } from "$lib/stores";
  import { loadMore } from "$lib/search";
  import { sort_options, default_sort } from "$lib/settings";
  import { saveSortSetting } from "$lib/localStorage";
  import PackageItem from "$lib/PackageItem.svelte";
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";

  // Sync local state with store
  let currentSort = $derived($search_sort);

  function handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    search_sort.set(target.value);
    saveSortSetting(target.value);
  }

  let sentinelElement: HTMLElement | null = $state(null);
  let observer: IntersectionObserver | null = null;

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && get(has_more) && !get(is_loading)) {
          loadMore(get(search_term), get(search_filter));
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    if (sentinelElement) {
      observer.observe(sentinelElement);
    }
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  // Re-observe when sentinel element changes
  $effect(() => {
    if (observer && sentinelElement) {
      observer.disconnect();
      observer.observe(sentinelElement);
    }
  });
</script>

<div class="results-header">
  <div class="results-header__count">
    We found: {$total_found} Plone add-ons
    {#if $package_list.length > 0 && $package_list.length < $total_found}
      <span class="results-header__showing">(showing {$package_list.length} of {$total_found})</span>
    {/if}
  </div>
  <div class="results-header__sort-wrapper">
    <label class="results-header__sort-label" for="sort-select">Sort by</label>
    <select id="sort-select" class="form-select results-header__sort" onchange={handleSortChange} value={currentSort}>
      {#each sort_options as option}
        <option value={option.value}>{option.title}</option>
      {/each}
    </select>
  </div>
</div>

<div class="package-list">
  {#each $package_list as item}
    {#if item.hits != undefined && item.hits.length >= 1}
      <PackageItem item={item.hits[0].document} />
    {/if}
  {/each}

  <!-- Sentinel element for infinite scroll -->
  <div bind:this={sentinelElement} class="package-list__sentinel">
    {#if $is_loading}
      <div class="package-list__loading">
        <span class="package-list__spinner"></span>
        Loading more packages...
      </div>
    {:else if !$has_more && $package_list.length > 0}
      <div class="package-list__all-loaded">All {$total_found} packages loaded</div>
    {/if}
  </div>
</div>

<style lang="scss">
  .package-list {
    display: flex;
    flex-direction: column;

    &__sentinel {
      min-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-md, 1rem);
    }

    &__loading {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm, 0.5rem);
      color: var(--color-text-muted, #666);
    }

    &__spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-border, #ddd);
      border-top-color: var(--color-primary, #0095d3);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    &__all-loaded {
      color: var(--color-text-muted, #666);
      font-style: italic;
      padding: var(--spacing-md, 1rem);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Mobile-first: stacked layout */
  .results-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--spacing-md, 1rem) var(--spacing-sm, 0.5rem);
    gap: var(--spacing-md, 1rem);

    &__count {
      font-style: italic;
      font-size: var(--font-size-lg, 1.2em);
    }

    &__showing {
      font-size: var(--font-size-sm, 0.8em);
      color: var(--color-text-muted, #666);
    }

    &__sort-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm, 0.5rem);
      width: 100%;
    }

    &__sort-label {
      font-size: var(--font-size-sm, 0.9em);
      color: var(--color-text-muted, #666);
      white-space: nowrap;
    }

    &__sort {
      width: 100%;
      max-width: 100%;
    }
  }

  /* Desktop: row layout */
  @media (min-width: 640px) {
    .results-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md, 1rem) 0;

      &__count {
        font-size: var(--font-size-xl, 1.4em);
      }

      &__sort-wrapper {
        width: auto;
      }

      &__sort {
        width: auto;
        max-width: 180px;
      }
    }
  }
</style>
