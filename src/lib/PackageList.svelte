<script>
  import { package_list } from "$lib/stores";
  import { results_count } from "$lib/stores";
  import PackageItem from "$lib/PackageItem.svelte";
</script>

<div class="results_count">Found: {$results_count} Plone add-on's</div>
<div class="package_list">
  {#each $package_list as item}
  {#if (item.hits != undefined && item.hits.length >= 1)}
    <PackageItem item={item.hits[0].document} />
  {/if}
  {/each}
</div>

<style>

.package_list {
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
}

.results_count{
  padding: 1em 0;
  font-style: italic;
}
</style>