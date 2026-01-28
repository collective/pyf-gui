# AGENTS.md

## Rules

- no claude code in commit messages!
- always keep update README.md up to date with changes!
- always keep CHANGES.md up to date with committed changes!
- don't run dev servers by your self, only if i command you to do so!
- expect the dev server is running


## btca

When you need up-to-date information about technologies used in this project, use btca to query source repositories directly.

**Available resources**: svelte, svelteKit, bootstrap, vite, typescript, typesense, mdsvex, sass

### Usage

```bash
btca ask -r <resource> -q "<question>"
```

Use multiple `-r` flags to query multiple resources at once:

```bash
btca ask -r svelte -r svelteKit -q "How do I use runes with SvelteKit load functions?"
```
