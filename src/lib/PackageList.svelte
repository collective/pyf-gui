<script lang="ts">
  import { package_list, is_loading, has_more, total_found, search_term, search_filter } from "$lib/stores";
  import { loadMore } from "$lib/search";
  import PackageItem from "$lib/PackageItem.svelte";
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";

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

<div class="results_count">
  We found: {$total_found} Plone add-ons
  {#if $package_list.length > 0 && $package_list.length < $total_found}
    <span class="showing">(showing {$package_list.length} of {$total_found})</span>
  {/if}
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

  .results_count {
    padding: 1em 0;
    font-style: italic;
    font-size: 1.4em;
  }

  .showing {
    font-size: 0.8em;
    color: #666;
  }

  @media (max-width: 640px) {
    .results_count {
      padding: 1em 0.5em;
      font-size: 1.2em;
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
