<script>
  import "../app.scss";
  let { children } = $props();
</script>

<header class="site-header">
  <nav class="site-header__nav">
    <a href="/" class="site-header__link">Home</a>
    <a href="/about" class="site-header__link">About</a>
    <a href="/help" class="site-header__link">Help</a>
  </nav>
  <div class="site-header__logo-headline">
    <div class="site-header__logo">
      <img src="/pag-logo.png" alt="PAG Logo" />
    </div>
    <h1 class="site-header__title">Plone Add-on Gallery</h1>
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

    &__nav {
      padding: var(--spacing-md, 1rem);
      font-weight: var(--font-weight-semibold, 600);
      font-family: var(--font-family-base, Verdana, Geneva, Tahoma, sans-serif);
      background-color: var(--color-primary, #0095d3);
    }

    &__link {
      color: var(--color-background, #fff);
      padding-right: var(--spacing-sm, 0.5em);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    &__logo-headline {
      background-color: var(--color-secondary, #fffdda);
      padding: min(2em, 1.5vh) 0;
      display: flex;
      flex-direction: column;
      font-weight: var(--font-weight-semibold, 600);
    }

    &__logo {
      text-align: center;
      padding-bottom: min(1em, 1.5vh);

      img {
        max-width: 90vw;
      }
    }

    &__title {
      text-align: center;
      color: var(--color-accent, #ff6600);
      margin-bottom: 0.1em;
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
