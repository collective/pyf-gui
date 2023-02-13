<script lang="ts">
  import { doSearch } from "./search";
  import { package_types } from "./settings";
  import { default_plone_versions } from "./settings";
  import { default_package_types } from "./settings";
  import { plone_versions } from "$lib/stores";
  import { getPackageType } from "$lib/utils";
  import type { Filter } from "$lib/interfaces";

  let term = "";
  let showPloneVersionsFilter = true;
  // let pVersions: string[] = [];
  let pVersions: string[] = default_plone_versions;
  let pTypes: string[] = default_package_types;
  // let package_types: string[] = [] ; //package_types[0].value;

  let filter: Filter = {
    plone_versions: pVersions,
    package_types: pTypes,
  };

  $: {
    filter.plone_versions = pVersions;
    filter.package_types = pTypes;
    // console.log(`pversions: ${pVersions}`);
    // console.log(`ptypes: ${pTypes}`);
    doSearch(term, filter);
  }

  function isDefaultVersion(value) {
    if (default_plone_versions.indexOf(value) != -1) {
      return true;
    }
    return false;
  }
  function handleSubmit() {
    doSearch();
  }
</script>

<div class="search_form">
  <form on:submit|preventDefault={handleSubmit}>
    <div class="field search">
      <div class="label">Search</div>
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
        <div class="label clickable"
            on:click={() => showPloneVersionsFilter = !showPloneVersionsFilter}
            on:keypress={() => showPloneVersionsFilter = !showPloneVersionsFilter}
            role="button"
            aria-expanded="true"
            aria-controls="plone-versions-filter"
            tabindex="0">
          Plone versions {#if !showPloneVersionsFilter}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
          {/if}{#if showPloneVersionsFilter}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
          </svg>
          {/if}
        </div>
        <div id="plone-versions-filter" class={showPloneVersionsFilter ? 'show' : ''}>
          {#each $plone_versions as version, i}
            {#if version.value.startsWith("Plone")}
              <div class="form-check form-check-inline form-switch">
                <input
                  bind:group={pVersions}
                  class="form-check-input"
                  type="checkbox"
                  id="plone_version_{i}"
                  value={version.value}
                />
                <lable class="form-check-label" for="plone_version_{i}">
                  {version.value.replace("Plone ", "")} ({version.count})
                </lable>
              </div>
            {/if}
          {/each}
        </div>
      </div>
      <div class="field package_types">
        <label for="package_type">Package types</label>
        {#each package_types as ptype, i}
          <div class="form-check form-check-inline form-switch">
            <input
              bind:group={pTypes}
              class="form-check-input"
              type="checkbox"
              id="package_type_{i}"
              value={ptype.value}
            />
            <lable class="form-check-label" for="package_type_{i}">
              {ptype.title}
            </lable>
          </div>
        {/each}
      </div>
    </div>
  </form>
</div>

<style lang="scss">
  label,
  .label {
    display: block;
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    padding: min(0.5em, 1vh) 0 min(0.5vh, 0.1em) 0;
    margin: min(0.5em, 1vh) 0 min(0.5vh, 0.8em) 0;
  }
  .clickable{
    cursor: pointer;
  }
  .field {
    border-bottom: 2px solid #d3d3d3;
    padding: 0.2em 0 min(2.2em, 3vh) 0;
  }
  #plone-versions-filter{
    display: none;
    &.show{
      display: block;
    }
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
    .search{
      input{
        min-width: 100%;
      }
    }
  }
</style>
