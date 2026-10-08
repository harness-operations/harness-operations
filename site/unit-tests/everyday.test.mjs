import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { discover, preferenceEvidence, preferencesForGoal, isReviewedSubject } from '../src/lib/discovery.mjs';
import { topics } from '../src/lib/guide-topics.mjs';
import { remarkSpecLinks } from '../scripts/remark-spec-links.mjs';

const index = JSON.parse(await readFile(new URL('../../systems/index.json', import.meta.url), 'utf8'));
const ids = ['chatgpt-consumer-web', 'claude-consumer-web', 'gemini-consumer-web', 'perplexity-consumer-web'];
const apps = ids.map((id) => index.subjects.find((subject) => subject.id === id));
const answers = { goal: 'everyday', mode: 'application', preferences: [] };
const selected = (preferences = [], subjects = index.subjects) => discover(subjects, { ...answers, preferences });

test('everyday application discovery has four scoped consumer applications, not vendor APIs', () => {
  assert.deepEqual(selected().matches.map(({ id }) => id), ids);
  for (const subject of apps) {
    assert.ok(isReviewedSubject(subject));
    assert.deepEqual(subject.kinds, ['application']);
    assert.match(subject.scope.interface, /personal web/);
    assert.match(subject.scope.configuration, /[Pp]ersonal/);
    assert.ok(!subject.comparison_scope, 'Do not borrow a coding/API comparison row');
  }
});
test('web research and document help match all four documented web applications', () => {
  assert.deepEqual(selected(['web-research', 'documents']).matches.map(({ id }) => id), ids);
});
test('memory requires its own reviewed field, not the presence of a conversation or session', () => {
  assert.deepEqual(selected(['web-research', 'documents', 'personal-memory']).matches.map(({ id }) => id), ids.slice(0, 3));
  const perplexity = apps[3];
  assert.deepEqual(preferenceEvidence(perplexity, 'personal-memory'), []);
  assert.match(perplexity.notes, /unassessed.*not recorded as unsupported/);
  assert.equal(selected(['personal-memory'], [{ ...perplexity, operational_characteristics: ['stable-session', 'resume', 'chat-history'] }]).reason, 'catalog-gap');
  const noMemoryMetadata = apps.map(({ operational_characteristics, ...subject }) => subject);
  assert.equal(selected(['personal-memory'], noMemoryMetadata).reason, 'catalog-gap');
});
test('web research never implies browser control, background execution, or voice APIs', () => {
  for (const subject of apps) for (const preference of ['browser', 'computer', 'background', 'coordination', 'voice']) {
    assert.deepEqual(preferenceEvidence(subject, preference), []);
  }
  for (const goal of ['automation', 'coding', 'creative']) {
    assert.equal(discover(apps, { goal, mode: 'any' }).reason, 'catalog-gap');
  }
});
test('consumer applications do not fill an everyday component gap or trigger relaxed constraints', () => {
  assert.equal(discover(index.subjects, { ...answers, mode: 'component' }).reason, 'catalog-gap');
  assert.equal(discover(index.subjects, { ...answers, requireOffline: true }).reason, 'invalid-answers');
  assert.equal(selected(['browser']).reason, 'invalid-answers');
});
test('new everyday fields are documented with primary-source references in each native entry', async () => {
  for (const subject of apps) {
    const text = await readFile(new URL(`../../${subject.document_path}`, import.meta.url), 'utf8');
    assert.ok(text.includes(`**Documentation reviewed:** ${subject.reviewed_at}`));
    for (const [field, values] of Object.entries({ kinds: subject.kinds, workloads: subject.workloads, operational_characteristics: subject.operational_characteristics || [] })) {
      for (const value of values) assert.match(text, new RegExp('`' + field + ': ' + value + '`.*\\[s\\d+\\]'), `${subject.id}: ${field}/${value}`);
    }
    for (const source of subject.sources) {
      assert.equal(source.type, 'primary_documentation');
      assert.ok(text.includes(source.url), `${subject.id}: missing source ${source.title}`);
    }
    assert.match(text, /## Limitations and review status/);
    assert.match(text, /not.*(test|trial|measured)|No authenticated/i);
  }
});
test('new document paths are published, navigable, and rewritten from canonical relative links', async () => {
  const sidebar = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  const overview = await readFile(new URL('../../systems/README.md', import.meta.url), 'utf8');
  for (const subject of apps) {
    const slug = subject.document_path.replace(/\.md$/, '');
    assert.ok(sidebar.includes(`slug: '${slug}'`));
    assert.ok(overview.includes(subject.document_path.replace('systems/', '')));
    for (const prefix of ['', '../systems/']) {
      const tree = { type: 'root', children: [{ type: 'link', url: prefix + subject.document_path.replace('systems/', '') + '#discovery-evidence', children: [] }] };
      remarkSpecLinks()(tree);
      assert.equal(tree.children[0].url, `/${slug}/#discovery-evidence`);
    }
  }
  const guide = topics.find(({ id }) => id === 'everyday');
  assert.equal(guide.goal, 'everyday');
  assert.deepEqual(guide.capabilities, [], 'No fabricated comparison observations');
  assert.equal(preferencesForGoal('everyday').length, 3);
});
