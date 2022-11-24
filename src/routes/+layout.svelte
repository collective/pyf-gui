<script>
  import "../app.scss";
</script>

<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <!-- <a href="/settings">Settings</a> -->
  </nav>
  <div class="logo-headline">
    <div id="logo">
      <img src="/pag-logo.png" alt="PAG Logo" />
    </div>
    <h1>Plone Add-on Gallery</h1>
  </div>
</header>

<main>
  <slot />
</main>

<footer>
  <p
    style="text-align: center;font-family: Verdana, Geneva, Tahoma, sans-serif;"
  >
    This service is brought to you by <a href="https://derico.de">Derico</a>
  </p>
</footer>

<style lang="scss">
  header {
    grid-area: header;
    nav {
      padding: MIN(1em, 1.2vw);
      // max-width: 640px;
      // margin: 0 auto;
      font-weight: 600;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      background-color: var(--bs-primary);
      a{
        color: #fff;
        padding-right: 0.5em;
        text-decoration: none;
      }
    }
    .logo-headline {
      background-color: var(--bs-secondary);
      padding: 2em 0;
      display: flex;
      flex-direction: column;
      font-weight: 600;
      #logo{
        padding-bottom: 1em;
      }
      #logo,
      h1 {
        text-align: center;
        color: #ff6600;
      }
    }
  }
  main {
    display: contents;
  }

  footer {
    grid-area: footer;
    padding-top: 1em;
    color: #fff;
    background-color: var(--bs-primary);
    a {
      color: #fff;
    }
  }

  // wider screens:
  @media (min-width: 640px) {
    footer {
    }
  }
</style>
