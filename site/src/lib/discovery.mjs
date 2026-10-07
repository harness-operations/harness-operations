/** Discovery is a filter over the reviewed Systems index, not a product ranking.
 * Missing metadata never establishes a capability, readiness, or a guarantee.
 */
export const GOALS = [
  { id: 'coding', label: 'Build software', hint: 'Write, test, and improve code.' },
  { id: 'automation', label: 'Automate work', hint: 'Work across websites, computers, and longer-running tasks.' },
  { id: 'creative', label: 'Create content', hint: 'Explore creative and video workflows.' },
  { id: 'everyday', label: 'Get everyday help', hint: 'Find out where our coverage can help—and where it cannot yet.' },
  { id: 'explore', label: 'Just explore', hint: 'See the range of reviewed tools and building blocks.' },
];
export const MODES = [
  { id: 'application', label: 'An application', hint: 'An application rather than an API. Setup may still be required.' },
  { id: 'developer', label: 'Developer tools', hint: 'Work with a harness or an application; check the exact interface.' },
  { id: 'component', label: 'Building blocks', hint: 'Integrate a framework, runtime, or tool into your own system.' },
  { id: 'any', label: 'Not sure yet', hint: 'Show the different options and explain what each one is.' },
];
export const PREFERENCES = [
  { id: 'browser', label: 'Work in a browser' },
  { id: 'computer', label: 'Use a desktop or computer' },
  { id: 'background', label: 'Run work in the background' },
  { id: 'coordination', label: 'Coordinate several agents' },
  { id: 'voice', label: 'Build a realtime voice experience' },
];
const GOAL_WORKLOADS = {
  coding: ['coding', 'software engineering', 'software testing', 'test generation', 'test repair'],
  automation: ['browser automation', 'web tasks', 'computer use', 'desktop automation'],
  creative: ['creative video', 'video editing'],
  everyday: ['everyday assistance', 'personal assistance'],
};
const MODE_KINDS = {
  application: ['application'],
  developer: ['harness', 'application'],
  component: ['framework', 'execution_runtime', 'tool_interface', 'tool_service', 'agent_definition', 'control_layer'],
};
const PREFERENCE_FIELDS = {
  browser: { workloads: ['browser automation', 'web tasks'] },
  computer: { workloads: ['computer use', 'desktop automation'] },
  background: { operational_characteristics: ['background', 'asynchronous'] },
  coordination: { operating_arrangements: ['coordinator_worker_threads', 'shared_state_workers'] },
  voice: { workloads: ['realtime voice', 'multimodal conversation'] },
};
const GOAL_PREFERENCES = {
  coding: ['coordination', 'background'],
  automation: ['browser', 'computer', 'background', 'coordination'],
  creative: ['background', 'coordination'],
  everyday: [],
  explore: PREFERENCES.map(({ id }) => id),
};
const strings = (value) => Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
export function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
export function subjectPath(subject) {
  return /^systems\/[a-z0-9-]+\.md$/.test(subject?.document_path || '')
    ? '/' + subject.document_path.replace(/\.md$/, '/') : null;
}
export function preferencesForGoal(goal) {
  return PREFERENCES.filter(({ id }) => (GOAL_PREFERENCES[goal] || []).includes(id));
}
function matchingFields(subject, fields) {
  return Object.entries(fields).flatMap(([field, accepted]) =>
    strings(subject?.[field]).filter((value) => accepted.includes(value)).map((value) => ({ field, value })),
  );
}
export function preferenceEvidence(subject, preference) {
  return matchingFields(subject, PREFERENCE_FIELDS[preference] || {});
}
export function kindLabel(subject) {
  const kinds = strings(subject?.kinds);
  if (kinds.includes('application')) return 'Application · setup may be required';
  if (kinds.includes('harness')) return 'Agent harness · check the interface';
  if (kinds.includes('domain_specification')) return 'Design document · not an executable tool';
  if (kinds.includes('model')) return 'Model · needs a surrounding runtime';
  return 'Building block · integration required';
}
/** Fail closed on incomplete records. Source links are evidence, not live tests. */
export function isReviewedSubject(subject) {
  return Boolean(subject && typeof subject.id === 'string' && typeof subject.name === 'string'
    && strings(subject.kinds).length && subjectPath(subject)
    && typeof subject.scope?.interface === 'string' && subject.scope.interface
    && typeof subject.scope?.deployment_mode === 'string' && subject.scope.deployment_mode
    && /^\d{4}-\d{2}-\d{2}$/.test(subject.reviewed_at || '')
    && Array.isArray(subject.sources) && subject.sources.some((source) => safeUrl(source?.url)));
}
/** All selected interests must have explicit matching metadata. Alphabetical, never scored. */
export function discover(subjects, answers = {}) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)
    || Object.keys(answers).some((key) => !['goal', 'mode', 'preferences'].includes(key))) {
    return { matches: [], reason: 'invalid-answers' };
  }
  const { goal, mode, preferences = [] } = answers;
  if (!GOALS.some(({ id }) => id === goal) || !MODES.some(({ id }) => id === mode)
    || !Array.isArray(preferences) || preferences.some((p) => !preferencesForGoal(goal).some(({ id }) => p === id))) {
    return { matches: [], reason: 'invalid-answers' };
  }
  const matches = [];
  const seen = new Set();
  for (const subject of Array.isArray(subjects) ? subjects : []) {
    if (!isReviewedSubject(subject) || seen.has(subject.id)) continue;
    // Models and design documents are useful learning material, not executable recommendations.
    if (!strings(subject.kinds).some((kind) => ['harness', 'application', ...MODE_KINDS.component].includes(kind))) continue;
    let goalEvidence = goal === 'explore' ? [] : matchingFields(subject, { workloads: GOAL_WORKLOADS[goal] });
    if (goal === 'automation') goalEvidence = [...goalEvidence, ...preferenceEvidence(subject, 'background')];
    if (goal !== 'explore' && !goalEvidence.length) continue;
    const modeEvidence = mode === 'any' ? [] : matchingFields(subject, { kinds: MODE_KINDS[mode] });
    if (mode !== 'any' && !modeEvidence.length) continue;
    if (!preferences.every((preference) => preferenceEvidence(subject, preference).length)) continue;
    seen.add(subject.id);
    const evidence = [...goalEvidence, ...modeEvidence, ...preferences.flatMap((preference) => preferenceEvidence(subject, preference))];
    const why = evidence.length
      ? `Reviewed catalog fields: ${[...new Set(evidence.map(({ value }) => value.replaceAll('_', ' ')))].join('; ')}.`
      : 'A reviewed agent tool or building block in the catalog. No task-specific fit is implied.';
    matches.push({ id: subject.id, subject, why, evidence });
  }
  matches.sort((a, b) => a.subject.name.localeCompare(b.subject.name, 'en') || a.id.localeCompare(b.id, 'en'));
  return { matches, reason: matches.length ? 'matched' : 'catalog-gap' };
}
