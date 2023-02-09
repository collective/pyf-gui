<script lang="ts">
  import PackageList from "$lib/PackageList.svelte";
  import SearchForm from "$lib/SearchForm.svelte";
  // import { unsub_search_filter, unsub_search_term } from "$lib/search";
  // import { onDestroy } from "svelte";

  // onDestroy(unsub_search_term);
  // onDestroy(unsub_search_filter);
</script>

<aside><SearchForm /></aside>
<article><PackageList /></article>

<style>

  aside {
    grid-area: sidebar;
    /* background-color: #0095d3; */
    padding: min(1em, 1vh) 0.5em min(1em, 2vh) 0.5em;
    max-width: 28ch;
  }
  article{
    grid-area: content;
    padding-bottom: 2em 1em 1.5em 1em;
    /* padding: MIN(1em, 1.2vw);
    max-width: 640px;
    margin: 0 auto;
    font-weight: 500; */
  }
  @media (max-width: 640px) {
    aside{
      max-width: 100ch;
      /* padding: 1em 1em 1.5em 1em; */
    }

  }
</style>
