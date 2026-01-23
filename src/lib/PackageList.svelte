<script lang="ts">
  import { package_list, is_loading, has_more, total_found, search_term, search_filter, search_sort } from "$lib/stores";
  import { loadMore } from "$lib/search";
  import { sort_options, default_sort } from "$lib/settings";
  import { loadSortSetting, saveSortSetting } from "$lib/localStorage";
  import PackageItem from "$lib/PackageItem.svelte";
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";

  let currentSort = $state(default_sort);

  // Load saved sort setting on mount (client-side only)
  onMount(() => {
    const savedSort = loadSortSetting();
    currentSort = savedSort;
    search_sort.set(savedSort);
  });

  function handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    currentSort = target.value;
    search_sort.set(currentSort);
    saveSortSetting(currentSort);
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
  <div class="results_count">
    We found: {$total_found} Plone add-ons
    {#if $package_list.length > 0 && $package_list.length < $total_found}
      <span class="showing">(showing {$package_list.length} of {$total_found})</span>
    {/if}
  </div>
  <select class="form-select sort-select" onchange={handleSortChange} value={currentSort}>
    {#each sort_options as option}
      <option value={option.value}>{option.title}</option>
    {/each}
  </select>
</div>
<div class="package_list">
  {#each $package_list as item}
    {#if item.hits != undefined && item.hits.length >= 1}
      <PackageItem item={item.hits[0].document} />
    {/if}
  {/each}

  <!-- Sentinel element for infinite scroll -->
  <div bind:this={sentinelElement} class="sentinel">
    {#if $is_loading}
      <div class="loading">
        <span class="spinner"></span>
        Loading more packages...
      </div>
    {:else if !$has_more && $package_list.length > 0}
      <div class="all-loaded">All {$total_found} packages loaded</div>
    {/if}
  </div>
</div>

<style lang="scss">
  .package_list {
    display: flex;
    flex-direction: column;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em 0;
    gap: 1em;
  }

  .results_count {
    font-style: italic;
    font-size: 1.4em;
  }

  .sort-select {
    width: auto;
    max-width: 180px;
  }

  .showing {
    font-size: 0.8em;
    color: #666;
  }

  @media (max-width: 640px) {
    .results-header {
      flex-direction: column;
      align-items: flex-start;
      padding: 1em 0.5em;
    }

    .results_count {
      font-size: 1.2em;
    }

    .sort-select {
      max-width: 100%;
      width: 100%;
    }
  }

  .sentinel {
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 0.5em;
    color: #666;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-top-color: #0095d3;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .all-loaded {
    color: #666;
    font-style: italic;
    padding: 1em;
  }
</style>
