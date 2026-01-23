<script lang="ts">
  import { formatNumber, getPackageType, getPloneVersions, getPythonVersions, toLocalizedTime } from '$lib/utils';

  let { item } = $props<{ item: any }>();

  function toLocalizedDate(datetime: string | number | null): string {
    if (!datetime) { return "" }
    // Handle Unix timestamps (numbers in seconds)
    const date = typeof datetime === 'number'
      ? new Date(datetime * 1000)
      : new Date(datetime);

    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString(undefined, options);
  }
</script>

<div class="package effect2">
  <div class="left-column">
    <div class="info">
      <div class="title"><h2><a href="/project/{item.name}">{item.name}</a></h2> <span class="title-metadata">{item.version} - {toLocalizedDate(item.upload_timestamp)}</span></div>
      <p>{item.summary}</p>
    </div>
  </div>
  <div class="right-column">
    <div class="versions">
    <div class="versions-left">
      <div class="plone_versions">
        <a href="https://pypi.org/project/{item.name}/" target="_blank" rel="noopener noreferrer">
          <div class="icon">
            <img src="/images/plone-icon.svg" alt="Plone Logo" />
          </div>
          <ul title={getPloneVersions(item.classifiers).join(', ')}>
            {#each getPloneVersions(item.classifiers) as ploneVersion}
              <li>{ploneVersion}</li>
            {/each}
          </ul>
        </a>
      </div>
      <div class="python_versions">
        <a href="https://pypi.org/project/{item.name}/" target="_blank" rel="noopener noreferrer">
          <div class="icon">
            <img src="/images/python-logo-only.svg" alt="Python Logo" />
          </div>
          <ul title={getPythonVersions(item.classifiers).join(', ')}>
            {#each getPythonVersions(item.classifiers) as pythonVersion}
              <li>{pythonVersion}</li>
            {/each}
          </ul>
        </a>
      </div>
    </div>
    <div class="versions-right">
      {#if item.download_last_month != undefined}
        <a href="https://pypi.org/project/{item.name}/" target="_blank" rel="noopener noreferrer" class="downloads-inline" title="Monthly downloads">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          <span>{formatNumber(item.download_last_month)}/mo</span>
        </a>
      {/if}
    </div>
    {#if item.download_total != undefined}
      <a href="https://pypi.org/project/{item.name}/" target="_blank" rel="noopener noreferrer" class="downloads-inline" title="Total downloads">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
        </svg>
        <span>{formatNumber(item.download_total)}</span>
      </a>
    {/if}
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
  <div class="meta">
    <span class="keywords" title="Keywords">{Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords}</span>
    <span class="type" title="Type">{getPackageType(item.classifiers)}</span>
  </div>
  </div>
</div>

<style lang="scss">
  .package {
    --box-padding: 0.8em;
    display: grid;
    width: 100%;
    margin: 0.6em auto;
    background-color: floralwhite;
    grid-template-columns: 1fr;
    grid-template-areas:
      "left"
      "right";
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
      grid-template-columns: 3.3fr 2fr;
      grid-template-areas:
        "left right";
    }
  }

  .left-column {
    grid-area: left;
  }

  .right-column {
    grid-area: right;
    display: flex;
    flex-direction: column;
  }

  .info {
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
    display: flex;

    .versions-left {
      flex: 1;
      background-color: #faeca2;
      padding: calc(var(--box-padding) / 2);
      display: flex;
      flex-direction: column;
      justify-content: start;
    }

    .versions-right {
      --downloads-padding: calc(var(--box-padding) / 2);
      flex: 0 0 4.5em;
      background-color: #d2e3ea;
      padding: calc(var(--downloads-padding) / 0.5) var(--downloads-padding);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      font-size: 0.9em;
    }

    .plone_versions,
    .python_versions {
      display: flex;
      padding: 0.2em 0;
      a {
        display: contents;
        color: inherit;
        text-decoration: none;

        &:hover {
          opacity: 0.8;
        }
      }
      .icon {
        text-align: center;
        padding: 0 0.5em;
        flex-shrink: 0;
      }
      img {
        width: 1.4em;
        height: auto;
      }
      ul {
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        flex-grow: 1;
        mask-image: linear-gradient(to right, black 70%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 70%, transparent 100%);
        list-style-type: none;
        margin: 0;
        padding: 0;
        font-size: 0.9em;
        cursor: pointer;
        li {
          padding: 0.2em 0.2em;
          white-space: nowrap;
        }
      }
    }

    .downloads-inline {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3em;
      color: #696767;
      font-size: 0.9em;
      text-decoration: none;
      svg {
        width: 1.1em;
        height: 1.1em;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .github {
    padding: var(--box-padding);
    background-color: #ffbd91;
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
  .meta {
    display: flex;
    font-size: 0.8em;
    color: var(--fbc-secondary-text);

    .keywords {
      flex: 1;
      padding: 0.3em var(--box-padding);
    }

    .type {
      flex: 0 0 4.5em;
      padding: 0.3em var(--box-padding);
      text-align: center;
    }
  }

  .effect2 {
    background: #fefefe;
    border: 1px solid #fff;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
  }
</style>
