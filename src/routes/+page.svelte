<script lang="ts">
  import PackageList from "$lib/PackageList.svelte";
  import SearchForm from "$lib/SearchForm.svelte";
  // import { unsub_search_filter, unsub_search_term } from "$lib/search";
  // import { onDestroy } from "svelte";

  // onDestroy(unsub_search_term);
  // onDestroy(unsub_search_filter);



</script>

<main>
  <img src="pag-logo.png" alt="PAG Logo" />
  <h1>Plone Add-on Gallery</h1>
  <div class="search">
    <div class="search-form"><SearchForm /></div>
  </div>
  <div><PackageList /></div>

</main>

<style>
  body {
    background-color: rgb(246, 246, 246);
  }
  main {
    /* text-align: center; */
    padding: min(1em, 1.2vw);
    max-width: 640px;
    margin: 0 auto;
  }

  h1 {
    color: #ff6600ff;
    font-size: 1.8em;
    font-weight: 500;
  }

  img {
    max-width: 100%;
  }

  @media (min-width: 640px) {
    main {
      max-width: 900px;
      background-color: rgb(251, 251, 251);
    }
  }

  .search{
    display:flex
  }

</style>
