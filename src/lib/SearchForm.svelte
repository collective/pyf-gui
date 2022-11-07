<script>
  import { doSearch } from "./search";
  import { package_types, plone_versions } from "./settings";

  let term = "";
  let plone_version = "";
  let package_type = "";
  let filter = {};

  $: {
    filter.plone_version = plone_version;
    filter.package_type = package_type;
    doSearch(term, filter);
  }
  //$: search_term.set(term), term, doSearch();

  function handleSubmit() {
    // search_term.set(term);
    doSearch();
  }
</script>

<div class="search_form">
  <form on:submit|preventDefault={handleSubmit}>
    <input
      type="text"
      placeholder="Packagename.."
      spellcheck="false"
      name="text"
      bind:value={term}
    />
    <div class="field">
      <label for="plone_version">Plone version</label>
      <select
        name="plone_version"
        id="plone_version"
        bind:value={plone_version}
      >
        {#each plone_versions as version}
          <option value={version.value} selected={version.default === true}>
            {version.title}
          </option>
        {/each}
      </select>
    </div>
    <div class="field">
      <label for="package_type">Package type</label>
      <select name="package_type" id="package_type" bind:value={package_type}>
        {#each package_types as ptype}
          <option value={ptype.value} selected={ptype.default === true}>
            {ptype.title}
          </option>
        {/each}
      </select>
    </div>
  </form>
</div>

<style>
  form {
    padding: 1.5rem;
  }
</style>
