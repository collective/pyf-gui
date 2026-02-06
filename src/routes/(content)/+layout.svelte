<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<article>
  {@render children()}
</article>

<style>
  article {
    grid-area: content;
    padding: 1em;
    min-height: 50vh;
  }
  article :global(pre) {
    margin: 1em 0;
    padding: 0.5em;
    background-color: wheat;
  }
  article :global(h2) {
    margin-top: 2em;
    border-bottom: 2px solid #ccc;
    padding-bottom: 0.3em;
  }
  article :global(h3) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  article :global(ul) {
    margin: 0.5em 0 1em 1.5em;
  }
  article :global(li) {
    margin-bottom: 0.3em;
  }
</style>
