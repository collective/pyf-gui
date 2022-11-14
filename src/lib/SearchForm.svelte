<script>
  import { doSearch } from "./search";
  import { package_types, plone_versions } from "./settings";

  let term = "";
  let plone_version = plone_versions[1].value;
  let package_type = package_types[0].value;
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
    <div class="field">
      <input
        type="text"
        placeholder="Packagename.."
        spellcheck="false"
        name="text"
        bind:value={term}
      />
    </div>
    <div class="field">
      <label for="plone_version">Plone version</label>
      <select
        name="plone_version"
        id="plone_version"
        bind:value={plone_version}
      >
        {#each plone_versions as version}
          <option value={version.value}>
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

<style lang="scss">
  form {
    display: flex;
    .field {
      display: flex;
      align-items: center;
      padding: 0 0.5em;
      label {
        margin-right: 0.4em;
        color: white;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
      input,
      select {
        display: block;
        padding: 0.375rem 2.25rem 0.375rem 0.75rem;
        line-height: 1.5em !important;
        margin: 0;
        font-size: 1rem;
        border: 1px solid #ced4da;
        border-radius: 0.375rem;
        appearance: none;
      }
      select{
        background-color: #fff;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 16px 12px;
      }
    }
  }
</style>
