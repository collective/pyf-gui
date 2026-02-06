<script>
  import { pageState } from '$lib/page-state.svelte';
  import { searchState, notifySearchInput } from '$lib/search-state.svelte';
  import "../app.scss";
  let { children } = $props();

  function handleMobileSearchInput() {
    searchState.term = pageState.searchTerm;
    notifySearchInput();
  }
</script>

<header class="site-header">
  <!-- Row 1: Logo + Site Name | Navigation -->
  <div class="site-header__row site-header__row--top">
    <div class="site-header__center">
      <div class="site-header__brand">
        <a href="/">
          <img src="/images/plone-logo-256.png" alt="Plone Logo" class="site-header__logo" />
          <span class="site-header__site-name">addon gallery</span>
        </a>
      </div>
      <nav class="site-header__nav">
        <a href="/" class="site-header__link">Home</a>
        <a href="/about" class="site-header__link">About</a>
        <a href="/help" class="site-header__link">Help</a>
      </nav>
    </div>
  </div>

  <!-- Row 2: Package Name + Version / Mobile Filter Toggle -->
  <div class="site-header__row site-header__row--package">
    <div class="site-header__package-info">
      {#if pageState.title}
        <h1 class="site-header__package-name">{pageState.title}</h1>
        {#if pageState.version}
          <span class="site-header__version">{pageState.version}</span>
        {/if}
      {/if}
    </div>
    <div class="site-header__package-actions">
      {#if pageState.showMobileFilter}
        <!-- Mobile search input -->
        <input
          type="text"
          class="mobile-search-input"
          placeholder="Search add-ons"
          bind:value={pageState.searchTerm}
          oninput={handleMobileSearchInput}
        />
        <button
          class="filter-toggle"
          onclick={() => pageState.filtersExpanded = !pageState.filtersExpanded}
          aria-expanded={pageState.filtersExpanded}
          aria-controls="filters-panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="filter-toggle__icon" viewBox="0 0 16 16">
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
          </svg>
          <span class="filter-toggle__label">Filters</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="filter-toggle__chevron" viewBox="0 0 16 16">
            {#if pageState.filtersExpanded}
              <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
            {:else}
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            {/if}
          </svg>
        </button>
      {/if}
    </div>
  </div>
</header>

<main class="site-main">
  {@render children()}
</main>

<footer class="site-footer">
  <p class="site-footer__text">
    This service is brought to you by <a href="https://derico.de" class="site-footer__link">Derico</a>.
  </p>
</footer>

<style lang="scss">
  .site-header {
    grid-area: header;

    &__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;

      @media (min-width: 640px) {
        display: grid;
        grid-template-columns: 1fr var(--sidebar-width) var(--content-width) 1fr;
        column-gap: var(--spacing-md);
        padding: 0.5rem 0;
      }
    }

    &__row--top {
      background-color: transparent;

      @media (min-width: 640px) {
        grid-template-columns: 1fr calc(var(--sidebar-width) + var(--content-width) + var(--spacing-md)) 1fr;
      }
    }

    &__center {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      @media (min-width: 640px) {
        grid-column: 2;
      }
    }

    &__row--package {
      background-color: var(--color-primary, #0095d3);
      min-height: 4rem;

      @media (max-width: 768px) {
        min-height: 4rem;
      }
    }

    &__brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }
    }

    &__logo {
      height: 2rem;
      width: auto;
    }

    &__site-name {
      color: #0083bd;
      font-weight: var(--font-weight-semibold, 600);
      font-size: 1.25rem;
    }

    &__nav {
      display: flex;
      gap: 1rem;
    }

    &__link {
      color: #0083bd;
      text-decoration: none;
      font-weight: var(--font-weight-semibold, 600);

      &:hover {
        text-decoration: underline;
      }
    }

    &__package-info {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;

      @media (min-width: 640px) {
        grid-column: 2 / 4;
      }
    }

    &__package-name {
      color: #fff;
      font-size: 1.5rem;
      margin: 0;
    }

    &__version {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
    }

    &__package-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm, 0.5rem);
      flex: 1;
      justify-content: flex-end;

      @media (min-width: 640px) {
        display: none;
      }
    }
  }

  .mobile-search-input {
    flex: 1;
    max-width: 60%;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: var(--border-radius-sm, 4px);
    font-size: var(--font-size-base, 1rem);
    background: #fff;
    color: var(--color-text, #333);

    &::placeholder {
      color: var(--color-text-muted, #666);
    }

    &:focus {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }

    @media (min-width: 640px) {
      display: none;
    }
  }

  .filter-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.5rem);
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: var(--font-family-base, inherit);
    font-size: var(--font-size-base, 1rem);
    font-weight: var(--font-weight-semibold, 600);
    color: #fff;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &:focus {
      outline: 2px solid #fff;
      outline-offset: -2px;
    }

    &__icon {
      flex-shrink: 0;
      color: #fff;
    }

    &__label {
      text-align: left;
    }

    &__chevron {
      flex-shrink: 0;
    }

    @media (min-width: 640px) {
      display: none;
    }
  }

  .site-main {
    display: contents;
  }

  .site-footer {
    grid-area: footer;
    padding: var(--spacing-md, 1em) var(--spacing-xs, 0.4em);
    color: var(--color-background, #fff);
    background-color: var(--color-primary, #0095d3);

    &__text {
      text-align: center;
      font-family: var(--font-family-base, Verdana, Geneva, Tahoma, sans-serif);
      margin: 0;
    }

    &__link {
      color: var(--color-background, #fff);
    }
  }
</style>
