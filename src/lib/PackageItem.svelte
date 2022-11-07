<script lang="ts">
  import { browser } from '$app/environment';
  import { CollapsibleCard } from 'svelte-collapsible?client'
  export let item = {};

  function getPloneVersions(classifiers:[]) {
    const versions = [];
    classifiers.forEach((cf) => {
      const regex = /^Framework :: Plone :: (?<version>\d+.*)$/im;
      const found = cf.match(regex);
      if (found && found.groups) {
        versions.push(found.groups.version);
      }
    });
    return versions;
  }

  function getPythonVersions(classifiers:[]) {
    const versions = [];
    classifiers.forEach((cf) => {
      const regex = /^Programming Language :: Python :: (?<version>\d+.*)$/im;
      const found = cf.match(regex);
      if (found && found.groups) {
        versions.push(found.groups.version);
      }
    });
    return versions;
  }

  function getPackageType(classifiers:[]) {
    let packageType = "";
    if (classifiers.indexOf("Framework :: Plone :: Addon") != -1) {
      packageType = "Addon";
    }
    if (classifiers.indexOf("Framework :: Plone :: Core") != -1) {
      packageType = "Core";
    }
    return packageType;
  }
</script>

<div class="package">
  <div class="info">
    <h2>{item.name}</h2>
    <p>{item.summary}</p>
  </div>
  <div>
    Plone versions:
    <ul>
      {#each getPloneVersions(item.classifiers) as ploneVersion}
        <li>{ploneVersion}</li>
      {/each}
    </ul>
  </div>
  <div>
    Python versions:
    <ul>
      {#each getPythonVersions(item.classifiers) as pythonVersion}
        <li>{pythonVersion}</li>
      {/each}
    </ul>
  </div>
  <div class="type">Type: {getPackageType(item.classifiers)}</div>
  <div class="keywords">
    keywords: {item.keywords}
  </div>
  <div>
    {#if browser}
    <CollapsibleCard open={false}>
      <h3 slot='header'>classifiers</h3>
      <ul slot='body'>
      {#each item.classifiers as classifier}
        <li>{classifier}</li>
      {/each}
      </ul>
    </CollapsibleCard>
    {/if}
  </div>
</div>

<style lang="scss">
  .package {
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 0 1em 1em 0;
    /* flex-basis: 40%; */
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
  }
  h2{
    margin-top: 0
  }
  div{
    padding: 0.5em;
    flex-grow: 1;
  }
  .info{
    /* width: 100%; */
  }
  .type{
    /* width: 100%; */
  }
</style>
