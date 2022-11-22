<script>
  import '../app.scss';
</script>
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <!-- <a href="/settings">Settings</a> -->
</nav>

<main>
  <slot />
  <p
    style="text-align: center;font-family: Verdana, Geneva, Tahoma, sans-serif;"
  >
    This service brought to you by <a href="https://derico.de">Derico</a>
  </p>
</main>

<style lang="scss">
  body {
    background-color: rgb(246, 246, 246);
  }
  nav{
    padding: MIN(1em, 1.2vw);
    max-width: 640px;
    margin: 0 auto;
    font-weight: 500;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  main {
    padding: MIN(1em, 1.2vw);
    max-width: 640px;
    margin: 0 auto;
    font-weight: 500;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
</style>
