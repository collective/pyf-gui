<script lang="ts">
  import { doSearch } from "./search";
  import { package_types } from "./settings";
  import { plone_versions } from "$lib/stores";
  import type { Filter } from '$lib/interfaces';

  let term = "";
  // let plone_versions:[] = [];
  // let python_versions:[] = [];
  let pVersions: string[] = [];
  let package_type = package_types[0].value;

  let filter: Filter = {
    plone_versions: [],
    package_type: "",
  };

  $: {
    filter.plone_versions = pVersions;
    filter.package_type = package_type;
    doSearch(term, filter);
  }

  function handleSubmit() {
    // search_term.set(term);
    doSearch();
  }
</script>

<div class="search_form">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="field search">
      <input
        type="text"
        placeholder="Packagename.."
        spellcheck="false"
        name="text"
        bind:value={term}
      />
    </div>
    <div class="filters">
      <div class="field plone_version">
        <div class="label">Plone version</div>
        {#each $plone_versions as version, i}
        <div class="form-check form-check-inline form-switch">
          <input
            bind:group={pVersions}
            class="form-check-input"
            type="checkbox"
            id="plone_version_{i}"
            value={version.value}
          />
          <lable class="form-check-label" for="plone_version_{i}">
            {version.value} ({version.count})
          </lable>
        </div>
        {/each}
      </div>
      <div class="field python_version">
        <label for="package_type">Package type</label>
        <select class="form-select form-select-sm" name="package_type" id="package_type" bind:value={package_type}>
          {#each package_types as ptype}
            <option value={ptype.value}>
              {ptype.title}
            </option>
          {/each}
        </select>
      </div>
    </div>
  </form>
</div>

<style lang="scss">
  label, .label{
    font-size: 1rem;
    font-weight: bold;
    color: whitesmoke;
    padding: 0.5em 0 0.2em 0;
  }
  form {
    // display: flex;
    // .field {
    //   display: flex;
    //   align-items: center;
    //   padding: 0 0.5em;
    //   label {
    //     margin-right: 0.4em;
    //     color: white;
    //     font-family: Verdana, Geneva, Tahoma, sans-serif;
    //   }
      // input,
      // select {
      //   display: block;
      //   padding: 0.375rem 2.25rem 0.375rem 0.75rem;
      //   line-height: 1.5em !important;
      //   margin: 0;
      //   font-size: 1rem;
      //   border: 1px solid #ced4da;
      //   border-radius: 0.375rem;
      //   appearance: none;
      // }
      // select {
      //   background-color: #fff;
      //   background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
      //   background-repeat: no-repeat;
      //   background-position: right 0.75rem center;
      //   background-size: 16px 12px;
      // }
    // }
  }
</style>
