import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { discover, GOALS, MODES, preferencesForGoal, preferenceEvidence, isReviewedSubject, isReviewedSource, isReviewDate, safeUrl, scopeRows } from '../src/lib/discovery.mjs';
const index = JSON.parse(await readFile(new URL('../../systems/index.json', import.meta.url), 'utf8'));
const base = {
  id: 'example', name: 'Example', kinds: ['harness'], workloads: ['coding'],
  scope: { interface: 'Exact CLI', deployment_mode: 'local process' }, reviewed_at: '2026-10-01',
  document_path: 'systems/example.md', sources: [{ url: 'https://example.org/docs', type: 'primary_documentation' }],
};
const coding = { goal: 'coding', mode: 'developer', preferences: [] };
const powerset = (items) => items.reduce((sets, item) => [...sets, ...sets.map((set) => [...set, item])], [[]]);

// Each combination is a separately reported regression, including every interest subset.
for (const goal of GOALS) for (const mode of MODES) {
  for (const preferences of powerset(preferencesForGoal(goal.id).map(({ id }) => id))) {
    test(`catalog combination: ${goal.id}/${mode.id}/${preferences.join('+') || 'no-interests'}`, () => {
      const before = JSON.stringify(index);
      const answers = { goal: goal.id, mode: mode.id, preferences };
      const result = discover(index.subjects, answers);
      const broad = discover(index.subjects, { ...answers, preferences: [] });
      assert.notEqual(result.reason, 'invalid-answers');
      assert.equal(result.reason, result.matches.length ? 'matched' : 'catalog-gap');
      assert.equal(new Set(result.matches.map(({ id }) => id)).size, result.matches.length);
      for (const match of result.matches) {
        assert.strictEqual(match.subject, index.subjects.find(({ id }) => id === match.id));
        assert.ok(broad.matches.some(({ id }) => id === match.id));
        for (const interest of preferences) assert.ok(preferenceEvidence(match.subject, interest).length);
        for (const { field, value } of match.evidence) assert.ok(match.subject[field].includes(value));
        if (mode.id === 'application') assert.ok(match.subject.kinds.includes('application'));
        assert.equal('score' in match, false);
      }
      assert.deepEqual(discover([...index.subjects].reverse(), answers).matches.map(({ id }) => id), result.matches.map(({ id }) => id));
      assert.equal(JSON.stringify(index), before);
    });
  }
}
test('all current canonical subjects remain valid: hardening does not silently shrink coverage', () => {
  for (const subject of index.subjects) assert.ok(isReviewedSubject(subject), subject.id);
});
test('malformed nested sources fail closed rather than crashing the renderer', () => {
  for (const sources of [[], [null], [base.sources[0], null], [{ url: 'https://example.org' }], [{ ...base.sources[0], type: 3 }], [{ ...base.sources[0], title: {} }]]) {
    assert.equal(isReviewedSubject({ ...base, sources }), false);
    assert.equal(discover([{ ...base, sources }], coding).reason, 'catalog-gap');
  }
  assert.equal(isReviewedSource(base.sources[0]), true);
});
test('calendar dates are real dates, not merely date-shaped strings', () => {
  for (const date of ['2026-02-29', '2026-02-30', '2026-13-01', '2026-00-10', '2026-10-00', '2026-10-01T00:00:00Z', {}, null]) {
    assert.equal(isReviewDate(date), false);
    assert.equal(isReviewedSubject({ ...base, reviewed_at: date }), false);
  }
  assert.equal(isReviewDate('2024-02-29'), true);
});
test('blank identity and incomplete material scope cannot become recommendations', () => {
  for (const subject of [{ ...base, id: ' ' }, { ...base, name: ' ' }, { ...base, scope: [] }, { ...base, scope: { ...base.scope, platform: {} } }, { ...base, scope: { ...base.scope, deployment_mode: ' ' } }]) {
    assert.equal(isReviewedSubject(subject), false);
  }
});
test('all material scope values survive the presentation projection unchanged', () => {
  const scope = { interface: 'API', version: '2', deployment_mode: 'hosted', platform: 'Linux', plan: 'Enterprise', configuration: 'Only with feature X enabled', revision: 'abc123', future_scope_field: 'Do not hide this limitation' };
  const rows = scopeRows({ ...base, scope });
  assert.deepEqual(Object.fromEntries(rows.map(({ key, value }) => [key, value])), scope);
  assert.equal(rows.find(({ key }) => key === 'plan').label, 'Plan / edition');
});
test('unsafe source URLs and coercible objects are not accepted as links', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,x', '//example.org', 'https://trusted.example@evil.example/', 'https://u:p@example.org', 'https://example.org/\npath', { toString: () => 'https://example.org/' }]) assert.equal(safeUrl(value), null);
  assert.equal(safeUrl('https://example.org/docs#section'), 'https://example.org/docs#section');
});
test('prototype property names are not valid public goal or preference lookups', () => {
  for (const value of ['__proto__', 'constructor', 'toString', null, {}]) {
    assert.deepEqual(preferencesForGoal(value), []);
    assert.deepEqual(preferenceEvidence(base, value), []);
  }
});
test('capabilities are never combined across distinct interfaces or configurations', () => {
  const browser = { ...base, id: 'browser-only', workloads: ['web tasks'], scope: { interface: 'Browser API', deployment_mode: 'hosted', plan: 'A' } };
  const background = { ...base, id: 'background-only', operational_characteristics: ['background'], scope: { interface: 'Worker API', deployment_mode: 'local', plan: 'B' } };
  assert.equal(discover([browser, background], { goal: 'explore', mode: 'any', preferences: ['browser', 'background'] }).reason, 'catalog-gap');
});
