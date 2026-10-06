# Harness Operations Site

The documentation site is part of the Harness Operations monorepo.

Canonical content lives in the repository root. The site renders the **same checkout**; it does not pin or fetch a separate specification release.

## Development

From `site/`:

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
npm run test:smoke
```

`scripts/sync-content.mjs` copies canonical Markdown and data from the parent checkout into Astro's generated content/data directories before every build.

## Release model

A Harness Operations release tags one monorepo commit. The release workflow validates the reference and site from that same commit, creates the GitHub Release, deploys Pages, and runs live-site QA.

There is no website release pin or promotion PR.
