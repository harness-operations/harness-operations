import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve('..');
const outputDirectory = resolve('src/content/docs');
const dataDirectory = resolve('src/data');
const publicSystemsDirectory = resolve('public/systems');
const publicDataDirectory = resolve('public/data');
const sourceRef = process.env.GITHUB_SHA || 'main';
const repository = 'harness-operations/harness-operations';

async function readSource(source) {
  return readFile(resolve(repoRoot, source), 'utf8');
}

function stripLeadingTitle(body) {
  return body.replace(/^#\s+[^\n]+\n+/, '');
}

function titleFromMarkdown(body, fallback) {
  const match = body.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

const staleGenerated = [
  resolve(outputDirectory, 'landscape.md'),
  resolve(outputDirectory, 'standards.md'),
  resolve(outputDirectory, 'systems'),
  resolve(outputDirectory, 'apply/example.md'),
  resolve(outputDirectory, 'apply/patterns'),
  resolve(outputDirectory, 'apply/mappings'),
  resolve(outputDirectory, 'apply/comparison-methodology.md'),
  resolve(outputDirectory, 'apply/external-validation.md'),
  resolve(dataDirectory, 'landscape.json'),
  resolve(dataDirectory, 'systems.json'),
  resolve(dataDirectory, 'systems-index.json'),
  resolve(publicSystemsDirectory, 'index.json'),
  resolve(publicDataDirectory, 'systems.json'),
];
for (const path of staleGenerated) {
  await rm(path, { recursive: true, force: true });
}

const systemsIndexBody = await readSource('systems/index.json');
const systemsIndex = JSON.parse(systemsIndexBody);
const systemSources = [
  'systems/README.md',
  'systems/TEMPLATE.md',
  'systems/operating-arrangements.md',
  'systems/coding-harnesses.md',
  ...systemsIndex.subjects.map((subject) => subject.document_path),
];
const uniqueSystemSources = [...new Set(systemSources)];

const staticDocuments = [
  ['reference/overview.md', 'overview.md', 'Overview', 'What Harness Operations is and where the operational problem begins.'],
  ['reference/principles.md', 'principles.md', 'Principles', 'Design principles for operating heterogeneous Harness systems.'],
  ['reference/model.md', 'model.md', 'Reference Model', 'Deeper conceptual vocabulary for definition, execution, evidence, and governance.'],
  ['reference/governance.md', 'governance.md', 'Governance', 'Authority, policy, delegation, approvals, exceptions, limits, and accountability.'],
  ['reference/standards.md', 'standards.md', 'Standards and Boundaries', 'Boundaries with MCP, ACP, A2A, Code Mode, telemetry, and adjacent standards.'],
  ['reference/terminology.md', 'terminology.md', 'Scope and Terminology', 'Shared scope and vocabulary for the descriptive Reference Model.'],
  ['examples/approved-artifact-handoff/README.md', 'apply/example.md', 'Approved artifact handoff', 'Executable example for approval, enforcement, uncertainty, and evidence.'],
  ['patterns/approval-valid-at-execution-time.md', 'apply/patterns/approval-valid-at-execution-time.md', 'Approval valid at execution time', 'Bind approval to the material action and revalidate at the enforcement boundary.'],
  ['patterns/stop-revoke-and-recover.md', 'apply/patterns/stop-revoke-and-recover.md', 'Stop, revoke, and recover', 'Treat interruption, revocation, side effects, and uncertain outcomes as distinct operational facts.'],
  ['patterns/model-informed-decisions.md', 'apply/patterns/model-informed-decisions.md', 'Model-informed decisions, code-enforced consequences', 'Keep model judgment, policy, authority, and enforcement distinct.'],
  ['comparisons/methodology.md', 'apply/comparison-methodology.md', 'Comparison methodology', 'How capability, evidence, freshness, scope, and interoperability claims are classified.'],
  ['reviews/v0.3-status.md', 'apply/external-validation.md', 'External validation status', 'Historical status of independent review and reproduction for the earlier applied work.'],
].map(([source, target, title, description]) => ({ source, target, title, description }));

const systemDocuments = uniqueSystemSources.map((source) => ({
  source,
  target:
    source === 'systems/README.md'
      ? 'systems/index.md'
      : source === 'systems/TEMPLATE.md'
        ? 'systems/template.md'
        : source,
  title: null,
  description:
    source === 'systems/README.md'
      ? 'Canonical concrete reference for Harnesses and adjacent systems.'
      : source === 'systems/TEMPLATE.md'
        ? 'Authoring contract for evidence-backed Systems reference entries.'
        : source === 'systems/operating-arrangements.md'
          ? 'Recurring ways Harnesses and adjacent systems operate independently and together.'
          : 'Evidence-backed Systems reference entry from the canonical repository.',
}));

const documents = [...staticDocuments, ...systemDocuments];
const fetchedDocuments = await Promise.all(
  documents.map(async (document) => {
    const body = await readSource(document.source);
    return {
      ...document,
      title: document.title ?? titleFromMarkdown(body, document.source),
      body,
    };
  }),
);

await mkdir(outputDirectory, { recursive: true });

for (const document of fetchedDocuments) {
  const editUrl = `https://github.com/${repository}/blob/${sourceRef}/${document.source}`;
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(document.title)}`,
    `description: ${JSON.stringify(document.description)}`,
    `editUrl: ${JSON.stringify(editUrl)}`,
    '---',
    '',
  ].join('\n');

  const targetPath = resolve(outputDirectory, document.target);
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, `${frontmatter}${stripLeadingTitle(document.body)}`, 'utf8');
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

console.log(
  `Synchronized ${fetchedDocuments.length} canonical documents, ${systemsIndex.subjects.length} Systems subjects, and ${comparison.observations.length} comparison observations from the local checkout.`,
);
