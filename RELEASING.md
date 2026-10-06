# Releasing Harness Operations

Harness Operations uses one monorepo release workflow: [`.github/workflows/release.yml`](.github/workflows/release.yml).

A release is cut manually from a reviewed **`main` commit**. The workflow takes:

- `version` — an immutable tag such as `v0.7`;
- `title` — the GitHub Release title.

If `releases/<version>.md` exists, it is used as the release notes. Otherwise GitHub-generated notes are used.

Before publishing, the workflow validates the exact commit end to end:

1. Systems index/schema and validation cases;
2. comparison data/schema;
3. approved-artifact example tests and deterministic demo;
4. exact-version Harness interface smoke tests;
5. the website built from the same monorepo checkout;
6. desktop/mobile browser smoke tests.

Only after verification does the workflow:

1. create the annotated release tag at that exact commit;
2. publish the GitHub Release;
3. deploy the already-verified `site/dist` artifact to GitHub Pages;
4. run browser smoke tests against https://harness-operations.com.

There is no `RELEASE.json`, website pin, promotion PR, polling workflow, or cross-repository content fetch.

## Cutting a release

1. Merge the intended release content to `main`.
2. Optionally add `releases/vX.Y.md` in a normal reviewed PR.
3. Open **Actions → Release Harness Operations → Run workflow** on `main`.
4. Enter the version and title.
5. Treat a green **live-qa** job as the end-to-end publication signal.

A failed pre-release verification creates no tag or GitHub Release. A failure after publication should be repaired with a new release rather than mutating an existing tag.
