<script lang="ts">
  import {
    compactPloneVersions,
    compactPythonVersions,
    formatNumber,
    getPackageType,
    processProjectUrls,
    toLocalizedTime,
  } from "$lib/utils";

  let { data } = $props();
</script>

{#if data.hit}
<aside class="package">
  <div class="github">
    <div class="github_icon">
      <a href={data.hit.github_url} target="_blank" title="open project page on GitHub"
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
      {#if data.hit.github_stars != undefined}
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
          <span>{data.hit.github_stars}</span>
        </div>
      {/if}
      {#if data.hit.github_watchers != undefined}
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
          <span>{data.hit.github_watchers}</span>
        </div>
      {/if}
      {#if data.hit.github_open_issues != undefined}
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
          <span>{data.hit.github_open_issues}</span>
        </div>
      {/if}
      {#if data.hit.github_updated != undefined}
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
          <span>{toLocalizedTime(data.hit.github_updated)}</span>
        </div>
      {/if}
    </div>
  </div>
  {#if data.hit.download_total != undefined || data.hit.download_last_month != undefined}
  <div class="downloads">
    <div class="sidebar-label">PyPI Downloads</div>
    <div class="downloads_data">
      {#if data.hit.download_total != undefined}
        <div title="Total downloads">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          <span>Total: {formatNumber(data.hit.download_total)}</span>
        </div>
      {/if}
      {#if data.hit.download_last_month != undefined}
        <div title="Monthly downloads">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-month" viewBox="0 0 16 16">
            <path d="M2.56 11.332 3.1 9.73h1.984l.54 1.602h.718L4.444 6h-.696L1.85 11.332h.71zm1.544-4.527L4.9 9.18H3.284l.8-2.375h.02zm5.746.422h-.676V9.77c0 .652-.414 1.023-1.004 1.023-.539 0-.98-.246-.98-1.012V7.227h-.676v2.746c0 .941.606 1.425 1.453 1.425.656 0 1.043-.28 1.188-.605h.027v.539h.668V7.227zm2.258 5.046c-.563 0-.91-.304-.985-.636h-.687c.094.683.625 1.199 1.668 1.199.93 0 1.746-.527 1.746-1.578V7.227h-.649v.578h-.019c-.191-.348-.637-.64-1.195-.64-.965 0-1.64.679-1.64 1.886v.34c0 1.23.683 1.902 1.64 1.902.558 0 1.008-.293 1.172-.648h.02v.605c0 .645-.423 1.023-1.071 1.023zm.008-4.53c.648 0 1.062.527 1.062 1.359v.253c0 .848-.39 1.364-1.062 1.364-.692 0-1.098-.512-1.098-1.364v-.253c0-.868.406-1.36 1.098-1.36z"/>
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
          </svg>
          <span>Monthly: {formatNumber(data.hit.download_last_month)}</span>
        </div>
      {/if}
      {#if data.hit.download_last_week != undefined}
        <div title="Weekly downloads">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-week" viewBox="0 0 16 16">
            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
          </svg>
          <span>Weekly: {formatNumber(data.hit.download_last_week)}</span>
        </div>
      {/if}
      {#if data.hit.download_last_day != undefined}
        <div title="Daily downloads">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-day" viewBox="0 0 16 16">
            <path d="M4.684 11.523v-2.3h2.261v-.61H4.684V6.801h2.464v-.61H4v5.332h.684zm3.296 0h.676V8.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a1.806 1.806 0 0 0-.254-.02c-.582 0-.891.32-1.012.567h-.02v-.504H7.98v4.105zm2.805-5.093c0 .238.192.425.43.425a.428.428 0 1 0 0-.855.426.426 0 0 0-.43.43zm.094 5.093h.672V7.418h-.672v4.105z"/>
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
          </svg>
          <span>Daily: {formatNumber(data.hit.download_last_day)}</span>
        </div>
      {/if}
      {#if data.hit.download_updated != undefined}
        <div title="Stats last updated">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
          </svg>
          <span>Updated: {toLocalizedTime(data.hit.download_updated)}</span>
        </div>
      {/if}
    </div>
  </div>
  {/if}
  {#if data.hit.project_urls && Object.keys(data.hit.project_urls).length > 0}
  <div class="project-links">
    <div class="sidebar-label">Project Links</div>
    <div class="project-links_data">
      {#each processProjectUrls(data.hit.project_urls) as link}
        <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}>
          {@html link.icon}
          <span>{link.label}</span>
        </a>
      {/each}
    </div>
  </div>
  {/if}
  <div class="versions">
      <div class="sidebar-label">Releases on <a href="{data.hit.project_url}" target="_blank" title="open project page on PyPi">PyPi</a></div>
      <ul class="releases">
        {#each data.releases as release}
          <li>
            <div class="release">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-box-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"
                />
              </svg>
              <a href="{data.hit.project_url}{release.version}" target="_blank">{release.version}</a>
            </div>
            <div class="release-versions">
              <div class="plone icon">
                  <img src="/images/plone-icon.svg" alt="Plone Logo" />
                {compactPloneVersions(release.framework_versions)}
              </div>
              <div class="python icon">
                  <img src="/images/python-logo-only.svg" alt="Python Logo" />
                {compactPythonVersions(release.python_versions)}
              </div>
            </div>
          </li>
        {/each}
      </ul>
  </div>

  <div class="keywords">
    keywords: {data.hit.keywords}
  </div>
  <div class="type">Type: {getPackageType(data.hit.classifiers)}</div>
</aside>
<article class="description">
  <!-- <h1>{data.hit.name}</h1> -->
  {@html data.hit.description}
</article>
{/if}

<style lang="scss">
  /* Sidebar styles - PyPI patterns */
  aside {
    --box-padding: var(--spacing-half, 15px);
    --section-padding: 20px;
    --section-margin: 20px;
    --section-border: 2px solid var(--color-border, #dcdcdc);
    grid-area: sidebar;
    padding: var(--spacing-sm, 15px) 0;
  }

  .sidebar-label {
    font-size: var(--font-size-lg, 1.1rem);
    font-weight: var(--font-weight-bold, 600);
    padding-left: var(--spacing-quarter, 7.5px);
    margin-bottom: var(--spacing-quarter, 7.5px);
    border-bottom: var(--section-border);

    a {
      text-decoration: none;
      color: var(--color-primary, #006dad);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* Article/Description styles - PyPI project-description patterns */
  article {
    grid-area: content;
    padding: var(--spacing-sm, 15px) var(--spacing-md, 30px) var(--spacing-md, 30px);
    line-height: var(--line-height-content, 1.5);

    /* Package name heading */
    :global(h1) {
      font-size: var(--font-size-4xl, 2.5rem);
      font-weight: var(--font-weight-bold, 600);
      border-bottom: 5px solid var(--color-primary, #006dad);
      padding: var(--spacing-half, 15px) 0;
      margin: 0 0 var(--spacing-md, 30px) 0;
    }

    /* Content headings with PyPI spacing */
    :global(h2) {
      font-size: var(--font-size-2xl, 1.3rem);
      font-weight: var(--font-weight-bold, 600);
      margin: var(--spacing-md, 30px) 0 0 0;
      padding-top: var(--spacing-md, 30px);
    }

    :global(h3) {
      font-size: var(--font-size-xl, 1.15rem);
      font-weight: var(--font-weight-bold, 600);
      margin: var(--spacing-md, 30px) 0 0 0;
    }

    :global(h4) {
      font-size: var(--font-size-lg, 1.1rem);
      font-weight: var(--font-weight-bold, 600);
      margin: var(--spacing-md, 30px) 0 0 0;
    }

    :global(h5),
    :global(h6) {
      font-size: var(--font-size-base, 1rem);
      font-weight: var(--font-weight-bold, 600);
      margin: var(--spacing-md, 30px) 0 0 0;
    }

    /* Paragraphs */
    :global(p) {
      margin: var(--spacing-half, 15px) 0 0 0;
    }

    /* Lists with PyPI spacing */
    :global(ul),
    :global(ol) {
      margin: var(--spacing-half, 15px) 0 0 var(--spacing-md, 30px);
      padding: 0;
    }

    @media (max-width: 480px) {
      :global(ul),
      :global(ol) {
        margin-left: var(--spacing-half, 15px);
      }
    }

    :global(li) {
      margin-bottom: var(--spacing-quarter, 7.5px);
    }

    /* Code blocks */
    :global(pre) {
      font-family: var(--font-family-code, "Source Code Pro", monospace);
      padding: var(--spacing-half, 15px);
      margin: var(--spacing-md, 30px) 0 0 0;
      background-color: var(--color-grey-base, #ececec);
      border-radius: var(--border-radius-sm, 4px);
      overflow-x: auto;
    }

    :global(code) {
      font-family: var(--font-family-code, "Source Code Pro", monospace);
      font-size: var(--font-size-sm, 0.8rem);
    }

    /* Inline code */
    :global(p code),
    :global(li code) {
      background-color: var(--color-grey-base, #ececec);
      padding: 0.1em 0.3em;
      border-radius: 3px;
    }

    /* Tables */
    :global(table) {
      margin: var(--spacing-md, 30px) 0 0 0;
      border-collapse: collapse;
      width: 100%;
    }

    :global(th),
    :global(td) {
      padding: 10px 7px;
      border: 1px solid var(--color-border, #dcdcdc);
      text-align: left;
    }

    :global(th) {
      background-color: var(--color-grey-base, #ececec);
      font-weight: var(--font-weight-bold, 600);
    }

    /* Blockquotes */
    :global(blockquote) {
      margin: var(--spacing-half, 15px) 0 0 var(--spacing-md, 30px);
      padding-left: var(--spacing-half, 15px);
      border-left: 3px solid var(--color-border, #dcdcdc);
      color: var(--color-text-muted, #666);
    }

    /* Images */
    :global(img) {
      max-width: 100%;
      height: auto;
      margin: var(--spacing-half, 15px) 0;
    }

    /* Definition lists */
    :global(dl) {
      margin: var(--spacing-md, 30px) 0 0 0;
    }

    :global(dt) {
      font-weight: var(--font-weight-bold, 600);
      margin-top: var(--spacing-half, 15px);
    }

    :global(dd) {
      margin-left: var(--spacing-md, 30px);
    }

    /* Figure */
    :global(figure) {
      margin: var(--spacing-md, 30px) 0;
    }
  }

  /* Versions section */
  .versions {
    padding-bottom: var(--section-padding);
    margin-bottom: var(--section-margin);
    border-bottom: var(--section-border);
    color: var(--color-text, #464646);

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0 var(--spacing-quarter, 7.5px);
      font-size: var(--font-size-base, 1rem);

      li {
        padding: var(--spacing-quarter, 7.5px) var(--spacing-quarter, 7.5px);
      }
    }

    .releases {
      padding: 0;

      li {
        display: flex;
        gap: var(--spacing-quarter, 7.5px);
        padding: var(--spacing-quarter, 7.5px);

        &:nth-child(even) {
          background-color: var(--color-grey-base, #ececec);
        }

        .release {
          min-width: 4em;
        }

        .release-versions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-quarter, 7.5px);

          .icon {
            display: flex;
            gap: var(--spacing-quarter, 7.5px);

            > img {
              width: 1.4em;
              height: auto;
              object-fit: contain;
              align-self: flex-start;
            }
          }
        }
      }
    }
  }

  /* GitHub section with colored background */
  .github {
    padding: var(--box-padding);
    padding-bottom: var(--section-padding);
    margin-bottom: var(--section-margin);
    border-bottom: var(--section-border);
    background-color: var(--color-grey-base, #ececec);
    color: var(--color-text, #464646);
    font-size: var(--font-size-sm, 0.8rem);
    display: flex;

    a {
      color: var(--color-text, #464646);
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
      padding-left: var(--spacing-half, 15px);

      > div {
        display: flex;
        padding: 0 var(--spacing-quarter, 7.5px) 0 0;

        svg {
          align-self: center;
          padding-bottom: 0.2em;
        }

        span {
          padding: var(--spacing-quarter, 7.5px);
          align-self: center;
        }
      }
    }
  }

  /* Downloads section with green background */
  .downloads {
    padding: var(--box-padding);
    padding-bottom: var(--section-padding);
    margin-bottom: var(--section-margin);
    border-bottom: var(--section-border);
    background-color: #e8f4e8;
    color: var(--color-text, #464646);
    font-size: var(--font-size-sm, 0.8rem);

    svg {
      width: auto;
      height: 1.2em;
    }

    .downloads_data {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      padding: var(--spacing-quarter, 7.5px) 0;

      > div {
        display: flex;
        padding: var(--spacing-quarter, 7.5px) var(--spacing-quarter, 7.5px);

        svg {
          align-self: center;
          padding-bottom: 0.2em;
        }

        span {
          padding: 0 var(--spacing-quarter, 7.5px);
          align-self: center;
        }
      }
    }
  }

  /* Project links section with blue background */
  .project-links {
    padding: var(--box-padding);
    padding-bottom: var(--section-padding);
    margin-bottom: var(--section-margin);
    border-bottom: var(--section-border);
    background-color: #e8e8f4;
    color: var(--color-text, #464646);
    font-size: var(--font-size-sm, 0.8rem);

    /* SVG icons injected via {@html} need :global() */
    :global(svg) {
      width: auto;
      height: 1.2em;
      flex-shrink: 0;
    }

    .project-links_data {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      padding: var(--spacing-quarter, 7.5px) 0;

      a {
        display: flex;
        align-items: center;
        padding: var(--spacing-quarter, 7.5px);
        text-decoration: none;
        color: var(--color-text, #464646);
        border-radius: var(--border-radius-sm, 4px);
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(0, 0, 0, 0.08);
        }

        :global(svg) {
          align-self: center;
        }

        span {
          padding: 0 var(--spacing-quarter, 7.5px);
          align-self: center;
        }
      }
    }
  }

  /* Keywords and type sections */
  .keywords {
    padding: var(--spacing-quarter, 7.5px) var(--box-padding);
    font-size: var(--font-size-sm, 0.8rem);
    color: var(--color-text-muted, #666);
  }

  .type {
    padding: var(--spacing-quarter, 7.5px) var(--box-padding) var(--box-padding) var(--box-padding);
    font-size: var(--font-size-sm, 0.8rem);
    color: var(--color-text-muted, #666);
  }
</style>
