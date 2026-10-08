/** Discovery filters reviewed catalog fields. It is not a product ranking or a guarantee. */
export const GOALS = [
  { id: 'coding', label: 'Build software', hint: 'Write, test, and improve code.' },
  { id: 'automation', label: 'Automate work', hint: 'Work across websites, computers, and longer-running tasks.' },
  { id: 'creative', label: 'Create content', hint: 'Explore creative and video workflows.' },
  { id: 'everyday', label: 'Get everyday help', hint: 'Explore personal assistants for questions, web research, and documents.' },
  { id: 'explore', label: 'Just explore', hint: 'See the range of reviewed tools and building blocks.' },
];
export const MODES = [
  { id: 'application', label: 'An application', hint: 'An application rather than an API. Setup may still be required.' },
  { id: 'developer', label: 'Developer tools', hint: 'Work with a harness or an application; check the exact interface.' },
  { id: 'component', label: 'Building blocks', hint: 'Integrate a framework, runtime, or tool into your own system.' },
  { id: 'any', label: 'Not sure yet', hint: 'Show the different options and explain what each one is.' },
];
export const PREFERENCES = [
  { id: 'browser', label: 'Automate browser tasks' },
  { id: 'computer', label: 'Control desktop applications' },
  { id: 'background', label: 'Run work in the background' },
  { id: 'coordination', label: 'Coordinate several agents' },
  { id: 'voice', label: 'Build a realtime voice experience' },
  { id: 'web-research', label: 'Find information on the web' },
  { id: 'documents', label: 'Ask about uploaded documents' },
  { id: 'personal-memory', label: 'Use context from past chats' },
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
  'web-research': { workloads: ['web research'] },
  documents: { workloads: ['document assistance'] },
  'personal-memory': { operational_characteristics: ['cross-chat-memory'] },
};
const GOAL_PREFERENCES = {
  coding: ['coordination', 'background'],
  automation: ['browser', 'computer', 'background', 'coordination'],
  creative: ['background', 'coordination'],
  everyday: ['web-research', 'documents', 'personal-memory'],
  explore: PREFERENCES.map(({ id }) => id),
};
const strings = (value) => Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (object, key) => typeof key === 'string' && Object.hasOwn(object, key);
export function safeUrl(value) {
  if (!text(value) || /[\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function subjectPath(subject) {
  return typeof subject?.document_path === 'string' && /^systems\/[a-z0-9-]+\.md$/.test(subject.document_path)
    ? '/' + subject.document_path.replace(/\.md$/, '/') : null;
}
export function preferencesForGoal(goal) {
  return PREFERENCES.filter(({ id }) => own(GOAL_PREFERENCES, goal) && GOAL_PREFERENCES[goal].includes(id));
}
function matchingFields(subject, fields) {
  return Object.entries(fields).flatMap(([field, accepted]) =>
    strings(subject?.[field]).filter((value) => accepted.includes(value)).map((value) => ({ field, value })),
  );
}
export function preferenceEvidence(subject, preference) {
  return matchingFields(subject, own(PREFERENCE_FIELDS, preference) ? PREFERENCE_FIELDS[preference] : {});
}
export function kindLabel(subject) {
  const kinds = strings(subject?.kinds);
  if (kinds.includes('application')) return 'Application · setup may be required';
  if (kinds.includes('harness')) return 'Agent harness · check the interface';
  if (kinds.includes('domain_specification')) return 'Design document · not an executable tool';
  if (kinds.includes('model')) return 'Model · needs a surrounding runtime';
  return 'Building block · integration required';
}
export function isReviewDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function isReviewedSource(source) {
  return record(source) && text(source.type) && Boolean(safeUrl(source.url))
    && (source.title === undefined || text(source.title));
}
/** Preserve every material scope field, including plan/platform/configuration and future fields. */
export function scopeRows(subject) {
  if (!record(subject?.scope)) return [];
  const labels = { interface: 'Reviewed interface', deployment_mode: 'Where it runs', version: 'Version', revision: 'Revision / scope', platform: 'Platform', plan: 'Plan / edition', configuration: 'Configuration' };
  return Object.entries(subject.scope).filter(([, value]) => text(value)).map(([key, value]) => ({
    key, label: own(labels, key) ? labels[key] : key.replaceAll('_', ' '), value,
  }));
}
/** Fail closed on malformed nested data before SSR or the chooser consumes it. */
export function isReviewedSubject(subject) {
  return Boolean(record(subject) && text(subject.id) && /^[a-z0-9][a-z0-9_-]*$/.test(subject.id)
    && text(subject.name) && strings(subject.kinds).some(text) && subjectPath(subject)
    && record(subject.scope) && text(subject.scope.interface) && text(subject.scope.deployment_mode)
    && Object.values(subject.scope).every(text) && isReviewDate(subject.reviewed_at)
    && Array.isArray(subject.sources) && subject.sources.length > 0 && subject.sources.every(isReviewedSource));
}
/** All selected interests need matching metadata on this same subject. Alphabetical, never scored. */
export function discover(subjects, answers = {}) {
  if (!record(answers) || Object.keys(answers).some((key) => !['goal', 'mode', 'preferences'].includes(key))) {
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
