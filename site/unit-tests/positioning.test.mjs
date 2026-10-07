import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('active introductory content does not revive the retired model', async () => {
  for (const path of [
    '../../README.md', '../../CONTRIBUTING.md', '../../systems/README.md',
    '../../reference/standards.md', '../astro.config.mjs',
    '../src/content/docs/index.mdx', '../src/content/docs/about.mdx',
    '../src/content/docs/capabilities.mdx', '../src/content/docs/glossary.mdx',
  ]) {
    const text = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.doesNotMatch(text, /reference[ -]model/i, path);
  }
});
