import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { topics } from '../src/lib/guide-topics.mjs';
import { archivedTargets, archiveNotice, documentFrontmatter, stripLeadingTitle } from './content-policy.mjs';

const repoRoot = resolve('..');
const outputDirectory = resolve('src/content/docs');
const dataDirectory = resolve('src/data');
const publicSystemsDirectory = resolve('public/systems');
const publicDataDirectory = resolve('public/data');
const sourceRef = process.env.GITHUB_SHA || 'main';
const repository = 'harness-operations/harness-operations';
const sourceUrl = (path) => `https://github.com/${repository}/blob/${sourceRef}/${path}`;
const readSource = (source) => readFile(resolve(repoRoot, source), 'utf8');
const titleFromMarkdown = (body, fallback) => body.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;

// Remove every generated route first, including legacy pages. A clean build and
// a rebuild must produce the same searchable corpus and archive metadata.
const staleGenerated = [
  'landscape.md', 'standards.md', 'systems', 'capabilities',
  'overview.md', 'principles.md', 'model.md', 'governance.md', 'terminology.md',
  'apply/example.md', 'apply/patterns', 'apply/mappings',
  'apply/comparison-methodology.md', 'apply/external-validation.md',
].map((path) => resolve(outputDirectory, path));
staleGenerated.push(
  resolve(dataDirectory, 'landscape.json'), resolve(dataDirectory, 'systems.json'),
  resolve(dataDirectory, 'systems-index.json'), resolve(publicSystemsDirectory, 'index.json'),
  resolve(publicDataDirectory, 'systems.json'),
);
for (const path of staleGenerated) await rm(path, { recursive: true, force: true });

const systemsIndexBody = await readSource('systems/index.json');
const systemsIndex = JSON.parse(systemsIndexBody);
const systemSources = [...new Set([
  'systems/README.md', 'systems/TEMPLATE.md', 'systems/operating-arrangements.md',
  'systems/coding-harnesses.md', ...systemsIndex.subjects.map((subject) => subject.document_path),
])];
const staticDocuments = [
  ['reference/overview.md', 'overview.md', 'Overview', ''],
  ['reference/principles.md', 'principles.md', 'Principles', ''],
  ['reference/model.md', 'model.md', 'Reference Model', ''],
  ['reference/governance.md', 'governance.md', 'Governance', ''],
  ['reference/terminology.md', 'terminology.md', 'Scope and Terminology', ''],
  ['reference/standards.md', 'standards.md', 'Standards and Boundaries', 'Optional background on MCP, ACP, A2A, Code Mode, telemetry, and adjacent standards.'],
  ['examples/approved-artifact-handoff/README.md', 'apply/example.md', 'Approved artifact handoff', 'An executable example of one approval and evidence pattern.'],
  ['patterns/approval-valid-at-execution-time.md', 'apply/patterns/approval-valid-at-execution-time.md', 'Approval valid at execution time', 'One pattern for binding approval to an action.'],
  ['patterns/stop-revoke-and-recover.md', 'apply/patterns/stop-revoke-and-recover.md', 'Stop, revoke, and recover', 'An optional pattern for interruption, revocation, and uncertain outcomes.'],
  ['patterns/model-informed-decisions.md', 'apply/patterns/model-informed-decisions.md', 'Model-informed decisions, code-enforced consequences', 'One way to separate model judgment from enforcement.'],
  ['comparisons/methodology.md', 'apply/comparison-methodology.md', 'Comparison methodology', 'How capability, evidence, freshness, scope, and interoperability claims are classified.'],
  ['reviews/v0.3-status.md', 'apply/external-validation.md', 'External validation status', ''],
].map(([source, target, title, description]) => ({ source, target, title, description }));
const systemDocuments = systemSources.map((source) => ({
  source,
  target: source === 'systems/README.md' ? 'systems/index.md' : source === 'systems/TEMPLATE.md' ? 'systems/template.md' : source,
  title: null,
  description: source === 'systems/README.md'
    ? 'Explore reviewed agent tools, applications, and components, with their evidence and limitations.'
    : 'A reviewed system entry with exact scope, sources, and limitations.',
}));
const documents = [...staticDocuments, ...systemDocuments];
await mkdir(outputDirectory, { recursive: true });
for (const document of documents) {
  const body = await readSource(document.source);
  const archived = archivedTargets.has(document.target);
  const frontmatter = documentFrontmatter({
    title: document.title ?? titleFromMarkdown(body, document.source),
    description: document.description, editUrl: sourceUrl(document.source), archived,
  });
  const targetPath = resolve(outputDirectory, document.target);
  await mkdir(dirname(targetPath), { recursive: true });
  // Keep historical body headings intact so existing fragments still resolve.
  await writeFile(targetPath, `${frontmatter}${archived ? archiveNotice : ''}${stripLeadingTitle(body)}`, 'utf8');
}

await mkdir(resolve(outputDirectory, 'capabilities'), { recursive: true });
for (const topic of topics) {
  const frontmatter = documentFrontmatter({ title: topic.title, description: topic.short, editUrl: sourceUrl('site/src/lib/guide-topics.mjs') });
  await writeFile(resolve(outputDirectory, `capabilities/${topic.id}.mdx`),
    `${frontmatter}\nimport CapabilityGuide from '../../../components/CapabilityGuide.astro';\n\n<CapabilityGuide topicId="${topic.id}" />\n`, 'utf8');
}
const comparisonBody = await readSource('comparisons/data/systems.json');
const comparison = JSON.parse(comparisonBody);
await mkdir(dataDirectory, { recursive: true });
await writeFile(resolve(dataDirectory, 'systems.json'), JSON.stringify(comparison, null, 2) + '\n', 'utf8');
await writeFile(resolve(dataDirectory, 'systems-index.json'), JSON.stringify(systemsIndex, null, 2) + '\n', 'utf8');
await mkdir(publicSystemsDirectory, { recursive: true });
await mkdir(publicDataDirectory, { recursive: true });
await writeFile(resolve(publicSystemsDirectory, 'index.json'), systemsIndexBody, 'utf8');
await writeFile(resolve(publicDataDirectory, 'systems.json'), comparisonBody, 'utf8');
console.log(`Synchronized ${documents.length} source documents, ${topics.length} capability guides, ${systemsIndex.subjects.length} subjects, and ${comparison.observations.length} observations.`);
