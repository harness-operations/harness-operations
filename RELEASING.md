# Releasing Harness Operations

Harness Operations has two independent publication paths:

- **Every merge to `main` deploys the website automatically.**
- **A release is an explicit immutable tag + GitHub Release cut from `main`.**

## Website deployment

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`.

Every pull request validates:

1. workflow syntax;
2. Systems and comparison data;
3. executable examples;
4. interface smoke checks;
5. the complete site build and link checks;
6. desktop/mobile browser tests.

After a pull request is merged, the resulting push to `main` runs the same validation and then:

1. uploads the verified `site/dist` artifact;
2. deploys it to GitHub Pages;
3. runs live browser QA against https://harness-operations.com.

So the production site always tracks the latest green `main` commit; cutting a formal release is not required to update the website.

## Cutting a release

Use **Actions → Release Harness Operations → Run workflow** on `main`.

Inputs:

- `version` — immutable tag such as `v0.7`;
- `title` — GitHub Release title.

If `releases/<version>.md` exists, it is used as release notes. Otherwise GitHub-generated notes are used.

The release workflow revalidates the exact `main` commit before creating:

1. the annotated tag;
2. the GitHub Release.

It does **not** deploy the website. That commit is already deployed through the normal merge-to-`main` pipeline.

There is no release pin, promotion PR, polling workflow, or cross-repository content fetch.
