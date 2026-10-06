# Harness Operations Site

The documentation site is part of the Harness Operations monorepo and renders canonical content from the same checkout.

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

## Deployment

Every green push to the monorepo's `main` branch deploys `site/dist` to GitHub Pages and runs live QA against https://harness-operations.com.

Formal GitHub Releases are separate: they tag immutable milestones, but the site does not wait for a release before deploying.
