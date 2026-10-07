import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { GOALS, MODES, discover, subjectPath } from '../src/lib/discovery.mjs';
import { topics } from '../src/lib/guide-topics.mjs';
const index = JSON.parse(await readFile(new URL('../../systems/index.json', import.meta.url), 'utf8'));
const comparison = JSON.parse(await readFile(new URL('../../comparisons/data/systems.json', import.meta.url), 'utf8'));
test('all chooser outputs come from the canonical index, without inferred scopes', () => {
  const ids = new Set(index.subjects.map(({ id }) => id));
  for (const goal of GOALS) for (const mode of MODES) {
    for (const match of discover(index.subjects, { goal: goal.id, mode: mode.id }).matches) {
      assert.ok(ids.has(match.id)); assert.ok(subjectPath(match.subject));
      for (const { field, value } of match.evidence) assert.ok(match.subject[field].includes(value));
    }
  }
});
test('guide comparison references are defined in the canonical dataset', () => {
  const ids = new Set(comparison.capabilities.map(({ id }) => id));
  assert.equal(new Set(topics.map(({ id }) => id)).size, topics.length);
  for (const topic of topics) for (const id of topic.capabilities) assert.ok(ids.has(id), `${topic.id}: ${id}`);
});
test('the selected hero derivative has the expected bytes', async () => {
  const image = await readFile(new URL('../public/images/hero-use-cases-selected.avif', import.meta.url));
  assert.equal(image.length, 49296);
  assert.equal(createHash('sha256').update(image).digest('hex'), '99ee660dd5efdd327b72e67218d8b3cb98af1ccf8ad99e28b892aa88488163bd');
});
