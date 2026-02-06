<script lang="ts">
  import { formatNumber, getHealthScoreColor, getPackageType, getPloneVersions, getPythonVersions, toLocalizedTime } from '$lib/utils';

  let { item } = $props<{ item: any }>();

  // Derived: check if this is an npm package
  let isNpmPackage = $derived(item.registry === 'npm');

  // Derived: registry URL (npm or PyPI)
  let registryUrl = $derived(
    isNpmPackage
      ? `https://www.npmjs.com/package/${item.name}`
      : `https://pypi.org/project/${item.name}/`
  );

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

<div class="package-card package-card--shadow">
  <div class="package-card__left">
    <div class="package-card__info">
      <div class="package-card__title">
        <h2>
          <a href="/project/{encodeURIComponent(item.name)}">{item.name}</a>
          {#if item.health_score !== undefined}
            {@const colors = getHealthScoreColor(item.health_score)}
            <span class="health-score-badge" style="background-color: {colors.bg}; color: {colors.text};" title="Health Score">
              {item.health_score}
            </span>
          {/if}
        </h2>
        <span class="package-card__title-meta">{item.version} - {toLocalizedDate(item.upload_timestamp)}</span>
      </div>
      <p class="package-card__summary">{item.summary}</p>
    </div>
  </div>
  <div class="package-card__right">
    <div class="package-card__versions">
      <div class="package-card__versions-left">
        {#if isNpmPackage}
          <div class="package-card__npm-info">
            <a href={registryUrl} target="_blank" rel="noopener noreferrer">
              <div class="package-card__version-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512" fill="currentColor">
                  <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"/>
                </svg>
              </div>
              <span class="package-card__registry-label">npm package</span>
            </a>
          </div>
        {:else}
          <div class="package-card__plone-versions">
            <a href={registryUrl} target="_blank" rel="noopener noreferrer">
              <div class="package-card__version-icon">
                <img src="/images/plone-icon.svg" alt="Plone Logo" />
              </div>
              <ul title={getPloneVersions(item.classifiers).join(', ')}>
                {#each getPloneVersions(item.classifiers) as ploneVersion}
                  <li>{ploneVersion}</li>
                {/each}
              </ul>
            </a>
          </div>
          <div class="package-card__python-versions">
            <a href={registryUrl} target="_blank" rel="noopener noreferrer">
              <div class="package-card__version-icon">
                <img src="/images/python-logo-only.svg" alt="Python Logo" />
              </div>
              <ul title={getPythonVersions(item.classifiers).join(', ')}>
                {#each getPythonVersions(item.classifiers) as pythonVersion}
                  <li>{pythonVersion}</li>
                {/each}
              </ul>
            </a>
          </div>
        {/if}
      </div>
      <div class="package-card__versions-right">
        {#if item.download_last_month != undefined}
          <a href={registryUrl} target="_blank" rel="noopener noreferrer" class="package-card__downloads" title={isNpmPackage ? "Weekly downloads" : "Monthly downloads"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            <span>{formatNumber(item.download_last_month)}/{isNpmPackage ? 'wk' : 'mo'}</span>
          </a>
        {/if}
      </div>
      {#if item.download_total != undefined}
        <a href={registryUrl} target="_blank" rel="noopener noreferrer" class="package-card__downloads" title="Total downloads">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          <span>{formatNumber(item.download_total)}</span>
        </a>
      {/if}
    </div>
    <div class="package-card__github">
      <div class="package-card__github-icon">
        <a href={item.github_url} target="_blank" title="View on GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div>
      <div class="package-card__github-data">
        {#if item.github_stars != undefined}
          <div title="Github stars">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            <span>{item.github_stars}</span>
          </div>
        {/if}
        {#if item.github_watchers != undefined}
          <div title="Github watchers">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
            </svg>
            <span>{item.github_watchers}</span>
          </div>
        {/if}
        {#if item.github_open_issues != undefined}
          <div title="Github open issues">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            <span>{item.github_open_issues}</span>
          </div>
        {/if}
        {#if item.github_updated != undefined}
          <div title="Last updated">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lungs-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v5.243L9 7.1V4.72C9 3.77 9.77 3 10.72 3c.524 0 1.023.27 1.443.592.431.332.847.773 1.216 1.229.736.908 1.347 1.946 1.58 2.48.176.405.393 1.16.556 2.011.165.857.283 1.857.24 2.759-.04.867-.232 1.79-.837 2.33-.67.6-1.622.556-2.741-.004l-1.795-.897A2.5 2.5 0 0 1 9 11.264V8.329l-1-.715-1 .715V7.214c-.1 0-.202.03-.29.093l-2.5 1.786a.5.5 0 1 0 .58.814L7 8.329v2.935A2.5 2.5 0 0 1 5.618 13.5l-1.795.897c-1.12.56-2.07.603-2.741.004-.605-.54-.798-1.463-.838-2.33-.042-.902.076-1.902.24-2.759.164-.852.38-1.606.558-2.012.232-.533.843-1.571 1.579-2.479.37-.456.785-.897 1.216-1.229C4.257 3.27 4.756 3 5.28 3 6.23 3 7 3.77 7 4.72V7.1l.5-.357V1.5A.5.5 0 0 1 8 1Zm3.21 8.907L9 8.329V7.214c.1 0 .202.03.29.093l2.5 1.786a.5.5 0 0 1-.58.814Z"/>
            </svg>
            <span>{toLocalizedTime(item.github_updated)}</span>
          </div>
        {/if}
      </div>
    </div>
    <div class="package-card__meta">
      <span class="package-card__keywords" title="Keywords">{Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords}</span>
      <span class="package-card__type" title="Type">{getPackageType(item.classifiers)}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .package-card {
    --card-padding: var(--spacing-md, 0.8em);
    display: grid;
    width: 100%;
    margin: var(--spacing-sm, 0.6em) auto;
    background-color: floralwhite;
    grid-template-columns: 1fr;
    grid-template-areas:
      "left"
      "right";

    &--shadow {
      background: #fefefe;
      border: 1px solid var(--color-background, #fff);
      border-radius: var(--border-radius-sm, 5px);
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
    }

    &__title {
      margin-bottom: var(--spacing-sm, 0.5em);

      h2 {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5em;
        margin-bottom: 0;
      }
    }

    .health-score-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65em;
      font-weight: var(--font-weight-semibold, 600);
      padding: 0.15em 0.5em;
      border-radius: 0.25em;
      line-height: 1.2;
      vertical-align: middle;
    }

    &__title-meta {
      font-size: 80%;
      color: var(--color-text-light, #777);
    }
  }

  @media (min-width: 800px) {
    .package-card {
      grid-template-columns: 3.3fr 2fr;
      grid-template-areas: "left right";
    }
  }

  .package-card__left {
    grid-area: left;
  }

  .package-card__right {
    grid-area: right;
    display: flex;
    flex-direction: column;
  }

  .package-card__info {
    padding: var(--card-padding);

    h2 {
      margin: 0 0 0.4em 0;
      font-size: var(--font-size-xl, 1.4rem);
      font-weight: var(--font-weight-semibold, 600);

      a {
        text-decoration: none;
      }
    }

    p {
      margin: 0.2em 0;
    }
  }

  .package-card__versions {
    display: flex;
  }

  .package-card__versions-left {
    flex: 1;
    background-color: #faeca2;
    padding: calc(var(--card-padding) / 2);
    display: flex;
    flex-direction: column;
    justify-content: start;
  }

  .package-card__versions-right {
    --downloads-padding: calc(var(--card-padding) / 2);
    flex: 0 0 4.5em;
    background-color: #d2e3ea;
    padding: calc(var(--downloads-padding) / 0.5) var(--downloads-padding);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: var(--font-size-sm, 0.9em);
  }

  .package-card__plone-versions,
  .package-card__python-versions,
  .package-card__npm-info {
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
  }

  .package-card__npm-info {
    align-items: center;

    .package-card__registry-label {
      font-size: var(--font-size-sm, 0.9em);
      padding: 0.2em 0.5em;
    }
  }

  .package-card__version-icon {
    text-align: center;
    padding: 0 var(--spacing-sm, 0.5em);
    flex-shrink: 0;

    img {
      width: 1.4em;
      height: auto;
    }
  }

  .package-card__plone-versions ul,
  .package-card__python-versions ul {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    flex-grow: 1;
    mask-image: linear-gradient(to right, black 70%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 70%, transparent 100%);
    list-style-type: none;
    margin: 0;
    padding: 0;
    font-size: var(--font-size-sm, 0.9em);
    cursor: pointer;

    li {
      padding: 0.2em 0.2em;
      white-space: nowrap;
    }
  }

  .package-card__downloads {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3em;
    color: var(--color-text-muted, #696767);
    font-size: var(--font-size-sm, 0.9em);
    text-decoration: none;

    svg {
      width: 1.1em;
      height: 1.1em;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  .package-card__github {
    padding: var(--card-padding);
    background-color: #ffbd91;
    color: var(--color-text, #333);
    font-size: var(--font-size-sm, 0.9em);
    display: flex;

    a {
      color: var(--color-text, #333);
    }

    svg {
      width: auto;
      height: 1.2em;
    }
  }

  .package-card__github-icon {
    flex-grow: 1;
    flex-shrink: 1;

    svg {
      width: auto;
      height: 2.4em;
    }
  }

  .package-card__github-data {
    flex-grow: 3;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding-left: var(--spacing-md, 1em);

    > div {
      display: flex;
      padding: 0 var(--spacing-sm, 0.5em) 0 0;

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

  .package-card__meta {
    display: flex;
    font-size: var(--font-size-sm, 0.8em);
    color: var(--color-text-muted, #666);
  }

  .package-card__keywords {
    flex: 1;
    padding: 0.3em var(--card-padding);
  }

  .package-card__type {
    flex: 0 0 4.5em;
    padding: 0.3em var(--card-padding);
    text-align: center;
  }
</style>
