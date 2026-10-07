import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discover, isReviewedSubject, preferenceEvidence, preferencesForGoal, kindLabel, safeUrl, subjectPath } from '../src/lib/discovery.mjs';
import { archivedTargets, documentFrontmatter, stripLeadingTitle } from '../scripts/content-policy.mjs';
const base = {
  id: 'example', name: 'Example', kinds: ['harness'], workloads: ['coding'],
  scope: { interface: 'Exact CLI', deployment_mode: 'local process' }, reviewed_at: '2026-10-01',
  document_path: 'systems/example.md', sources: [{ url: 'https://example.org/docs', type: 'primary_documentation' }],
};
const coding = { goal: 'coding', mode: 'developer', preferences: [] };
const match = (subject, answers = coding) => discover([subject], answers);

test('matches only explicit reviewed workload and kind metadata', () => {
  assert.equal(match(base).matches.length, 1);
  assert.match(match(base).matches[0].why, /coding; harness/);
  assert.equal(match({ ...base, workloads: ['video editing'] }).reason, 'catalog-gap');
});
test('does not turn developer interfaces into applications', () => {
  assert.equal(match(base, { ...coding, mode: 'application' }).matches.length, 0);
  const app = { ...base, kinds: ['application'] };
  assert.equal(match(app, { ...coding, mode: 'application' }).matches.length, 1);
  assert.match(kindLabel(app), /setup may be required/);
});
test('everyday help does not fall back to coding or adjacent components', () => {
  for (const mode of ['any', 'application', 'developer', 'component']) {
    assert.equal(match(base, { goal: 'everyday', mode }).reason, 'catalog-gap');
  }
});
test('missing or unknown metadata does not satisfy an interest', () => {
  const answers = { ...coding, preferences: ['background'] };
  assert.equal(match(base, answers).matches.length, 0);
  assert.equal(match({ ...base, operational_characteristics: ['unknown'] }, answers).matches.length, 0);
  assert.equal(match({ ...base, operational_characteristics: ['background'] }, answers).matches.length, 1);
});
test('all selected interests need explicit evidence, not a weighted score', () => {
  const answers = { goal: 'explore', mode: 'any', preferences: ['browser', 'background'] };
  assert.equal(match({ ...base, workloads: ['web tasks'] }, answers).matches.length, 0);
  const complete = { ...base, workloads: ['web tasks'], operational_characteristics: ['background'] };
  assert.equal(match(complete, answers).matches.length, 1);
  assert.equal('score' in match(complete, answers).matches[0], false);
});
test('local process text is never evidence of privacy or offline execution', () => {
  assert.deepEqual(preferenceEvidence(base, 'offline'), []);
  assert.equal(match(base, { ...coding, preferences: ['offline'] }).reason, 'invalid-answers');
});
test('unsupported mandatory constraints are rejected, not silently ignored', () => {
  assert.equal(match(base, { ...coding, requireLocalInference: true }).reason, 'invalid-answers');
});
test('rejects invalid goals, modes, and unrelated interests', () => {
  for (const answers of [null, [], {}, { ...coding, goal: 'bogus' }, { ...coding, mode: 'bogus' }, { ...coding, preferences: 'browser' }, { ...coding, preferences: ['voice'] }]) {
    assert.equal(match(base, answers).reason, 'invalid-answers');
  }
});
test('excludes incomplete and unsourced records', () => {
  for (const key of ['scope', 'reviewed_at', 'document_path', 'sources', 'kinds']) {
    const subject = { ...base }; delete subject[key];
    assert.equal(isReviewedSubject(subject), false);
    assert.equal(match(subject).matches.length, 0);
  }
  assert.equal(match({ ...base, sources: [{ url: 'javascript:alert(1)' }] }).matches.length, 0);
});
test('does not recommend bare models or non-executable specifications', () => {
  for (const kind of ['model', 'domain_specification']) {
    assert.equal(match({ ...base, kinds: [kind] }, { goal: 'explore', mode: 'any' }).matches.length, 0);
  }
});
test('components stay clearly identified as integration work', () => {
  const component = { ...base, kinds: ['tool_interface'] };
  assert.equal(match(component, { ...coding, mode: 'component' }).matches.length, 1);
  assert.match(kindLabel(component), /integration required/);
});
test('ordering is alphabetical, deduplicated, and does not mutate the catalog', () => {
  const a = { ...base, id: 'a', name: 'Alpha' }, z = { ...base, id: 'z', name: 'Zulu' };
  const input = [z, a, a]; const before = JSON.stringify(input);
  assert.deepEqual(discover(input, coding).matches.map(({ id }) => id), ['a', 'z']);
  assert.equal(JSON.stringify(input), before);
});
test('changing goals only offers relevant interests', () => {
  assert.equal(preferencesForGoal('everyday').length, 0);
  assert.equal(preferencesForGoal('coding').some(({ id }) => id === 'browser'), false);
  assert.equal(preferencesForGoal('explore').some(({ id }) => id === 'voice'), true);
});
test('background operation can qualify for automation without inventing a workload', () => {
  const runtime = { ...base, workloads: [], kinds: ['execution_runtime'], operational_characteristics: ['asynchronous'] };
  assert.equal(match(runtime, { goal: 'automation', mode: 'component' }).matches.length, 1);
});
test('links are bounded to published system paths and web sources', () => {
  assert.equal(subjectPath(base), '/systems/example/');
  assert.equal(subjectPath({ document_path: '../../private.md' }), null);
  assert.equal(safeUrl('data:text/html,unsafe'), null);
  assert.equal(safeUrl('/relative'), null);
  assert.equal(safeUrl('https://example.org/docs'), 'https://example.org/docs');
});
test('empty and malformed catalogs return coverage gaps, not invented options', () => {
  for (const subjects of [[], null, [null], [{}]]) assert.equal(discover(subjects, coding).reason, 'catalog-gap');
});
test('historical documents are explicitly archived and excluded from discovery', () => {
  for (const target of ['model.md', 'overview.md', 'principles.md', 'governance.md', 'terminology.md']) assert.equal(archivedTargets.has(target), true);
  assert.equal(archivedTargets.has('standards.md'), false);
  const fm = documentFrontmatter({ title: 'Reference Model', description: 'old', editUrl: 'https://example.org/source', archived: true });
  assert.match(fm, /Archived: Reference Model/); assert.match(fm, /pagefind: false/); assert.match(fm, /noindex, follow/);
  assert.match(fm, /prev: false/); assert.match(fm, /next: false/);
});
test('source heading removal preserves legacy section heading text', () => {
  assert.equal(stripLeadingTitle('# Model\n\n## Definitions\n\nBody\n'), '## Definitions\n\nBody\n');
});
