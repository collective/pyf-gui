<script lang="ts">
  import { getPloneVersions, getPythonVersions, getPackageType, toLocalizedTime } from '$lib/utils';
  import { browser } from "$app/environment";
  import collapse from "svelte-collapse";

  export let item = {} as any;
  let classifiersOpen = false;

  function toLocalizedDate(datetime){
    if (!datetime) { return "" }
    return new Date(datetime).toLocaleDateString()
  }

</script>

<div class="package effect2">
  <div class="info">

    <div class="title"><h2><a href="/project/{item.id}">{item.name}</a></h2> <span class="title-metadata">{item.version} - {toLocalizedDate(item.upload_timestamp)}</span></div>

    <p>{item.summary}</p>
  </div>
  <div class="versions">
    <div class="plone_versions">
      <div class="icon">
        <img src="/images/plone-icon.svg" alt="Plone Logo" />
      </div>
      <ul>
        {#each getPloneVersions(item.classifiers) as ploneVersion}
          <li>{ploneVersion}</li>
        {/each}
      </ul>
    </div>
    <div class="python_versions">
      <div class="icon">
        <img src="/images/python-logo-only.svg" alt="Python Logo" />
      </div>
      <ul>
        {#each getPythonVersions(item.classifiers) as pythonVersion}
          <li>{pythonVersion}</li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="github">
    <div class="github_icon">
      <a href={item.github_url} target="_blank"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-github"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg></a
      >
    </div>
    <div class="github_data">
      {#if item.github_stars != undefined}
        <div title="Github stars">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-star-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
          </svg>
          <span>{item.github_stars}</span>
        </div>
      {/if}
      {#if item.github_watchers != undefined}
        <div title="Github watchers">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-eye-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
            <path
              d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
            />
          </svg>
          <span>{item.github_watchers}</span>
        </div>
      {/if}
      {#if item.github_open_issues != undefined}
        <div title="Github open issues">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-exclamation-circle-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
            />
          </svg>
          <span>{item.github_open_issues}</span>
        </div>
      {/if}
      {#if item.github_updated != undefined}
        <div title="Last updated">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-lungs-fill"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1a.5.5 0 0 1 .5.5v5.243L9 7.1V4.72C9 3.77 9.77 3 10.72 3c.524 0 1.023.27 1.443.592.431.332.847.773 1.216 1.229.736.908 1.347 1.946 1.58 2.48.176.405.393 1.16.556 2.011.165.857.283 1.857.24 2.759-.04.867-.232 1.79-.837 2.33-.67.6-1.622.556-2.741-.004l-1.795-.897A2.5 2.5 0 0 1 9 11.264V8.329l-1-.715-1 .715V7.214c-.1 0-.202.03-.29.093l-2.5 1.786a.5.5 0 1 0 .58.814L7 8.329v2.935A2.5 2.5 0 0 1 5.618 13.5l-1.795.897c-1.12.56-2.07.603-2.741.004-.605-.54-.798-1.463-.838-2.33-.042-.902.076-1.902.24-2.759.164-.852.38-1.606.558-2.012.232-.533.843-1.571 1.579-2.479.37-.456.785-.897 1.216-1.229C4.257 3.27 4.756 3 5.28 3 6.23 3 7 3.77 7 4.72V7.1l.5-.357V1.5A.5.5 0 0 1 8 1Zm3.21 8.907L9 8.329V7.214c.1 0 .202.03.29.093l2.5 1.786a.5.5 0 0 1-.58.814Z"
            />
          </svg>
          <span>{toLocalizedTime(item.github_updated)}</span>
        </div>
      {/if}
    </div>
  </div>
  <div class="keywords">
    keywords: {item.keywords}
  </div>
  <div class="type">Type: {getPackageType(item.classifiers)}</div>
  <div class="classifiers">
    {#if browser}
      <div class="label">
        <a on:click={() => (classifiersOpen = !classifiersOpen)}>classifiers</a>
      </div>
      <div>
        <ul
          use:collapse={{
            open: classifiersOpen,
            duration: 0.2,
            easing: "ease",
          }}
        >
          {#each item.classifiers as classifier}
            <li>{classifier}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .package {
    --box-padding: 0.8em;
    // border: 1px solid #aaa;
    // border-radius: 2px;
    // box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    display: grid;
    width: 100%;
    margin: 0.6em auto;
    background-color: floralwhite;
    grid-template-columns: 1fr;
    grid-template-areas:
      "info"
      "versions"
      "github"
      "keywords"
      "type"
      "classifiers";
    .title{
      margin-bottom: 0.5em;
      h2{
        display: block;
        margin-bottom: 0;
      }
      .title-metadata{
        font-size: 80%;
        color: #777;
      }
    }
  }

  @media (min-width: 800px) {
    .package {
      grid-template-columns: 3fr 2fr;
      grid-template-areas:
        "info versions"
        "keywords github"
        "type github"
        "classifiers classifiers";
    }
  }

  .box-effect {
    -webkit-box-shadow: 0 10px 6px -6px #777;
    -moz-box-shadow: 0 10px 6px -6px #777;
    box-shadow: 0 10px 6px -6px #777;
  }

  .info {
    grid-area: info;
    padding: var(--box-padding);
    h2 {
      margin: 0 0 0.4em 0;
      font-size: 1.4rem;
      font-weight: 600;
      a{
        text-decoration: none;
      }
    }
    p {
      margin: 0.2em 0;
    }
  }
  .versions {
    grid-area: versions;
    background-color: #faeca2;
    color: #333;
    padding: var(--box-padding) var(--box-padding) 0.2em 0.2em;
    p {
      margin: 0.2em 0;
    }
    .plone_versions,
    .python_versions {
      display: flex;
      padding: 0.2em 0 0 0;
      .icon {
        text-align: center;
        padding: 0 0.5em;
      }
      img {
        width: 1.4em;
        height: auto;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        list-style-type: none;
        margin: 0;
        padding: 0 0.5em;
        font-size: 1.1em;
        li {
          padding: 0.2em 0.5em;
        }
      }
    }
  }
  .github {
    grid-area: github;
    padding: var(--box-padding);
    background-color: #eee;
    color: #333;
    font-size: 0.9em;
    display: flex;
    a {
      color: #333;
    }
    svg {
      width: auto;
      height: 1.2em;
    }
    .github_icon {
      flex-grow: 1;
      flex-shrink: 1;
      svg {
        width: auto;
        height: 2.4em;
      }
    }
    .github_data {
      flex-grow: 3;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      padding-left: 1em;
      > div {
        display: flex;
        padding: 0 0.5em 0 0;
        svg {
          align-self: center;
          padding-bottom: 0.2em;
        }
        span {
          padding: 0.4em;
          align-self: center;
        }
      }
    }
  }
  .keywords {
    grid-area: keywords;
    padding: 0.3em var(--box-padding);
    color: var(--fbc-secondary-text);
  }
  .type {
    grid-area: type;
    padding: 0.3em var(--box-padding) var(--box-padding) var(--box-padding);
    color: var(--fbc-secondary-text);
  }
  .classifiers {
    display: none;
    grid-area: classifiers;
    padding: var(--box-padding);
    cursor: pointer;
    background-color: #d5e4f6;
    color: rgb(0, 0, 0);
    .label {
      a {
        font-size: 1rem;
        text-decoration: overline;
        color: rgb(0, 0, 0);
        &::after {
          content: "▼";
          padding-left: 0.2em;
          font-size: 0.9rem;
        }
      }
    }
  }

  /*==================================================
 * Effect 1
 * ===============================================*/
  .effect1 {
    // -webkit-box-shadow: 0 10px 6px -6px #777;
    // -moz-box-shadow: 0 10px 6px -6px #777;
    box-shadow: 0 10px 6px -6px #777;
    box-shadow: 10 -10px 6px -6px #777;
  }

  .effect2 {
    background: #f5f5f5;
    border: 1px solid #fff;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
  }
</style>
