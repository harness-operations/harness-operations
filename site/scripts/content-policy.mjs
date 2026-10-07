/** These legacy documents are retained for stable routes/anchors, not onboarding. */
export const archivedTargets = new Set([
  'overview.md', 'principles.md', 'model.md', 'governance.md', 'terminology.md',
  'apply/external-validation.md',
]);
export const archiveNotice = '> **Archived design material.** This page is retained for historical links and provenance. It no longer defines the project approach or requirements. Start with [capability guides](/capabilities/), [reviewed tools](/systems/), or [the chooser](/choose/).\n\n';
export function documentFrontmatter({ title, description, editUrl, archived = false }) {
  return [
    '---',
    `title: ${JSON.stringify(archived ? `Archived: ${title}` : title)}`,
    `description: ${JSON.stringify(archived ? 'Historical material retained for existing links; not active project guidance.' : description)}`,
    `editUrl: ${JSON.stringify(editUrl)}`,
    ...(archived ? [
      'pagefind: false', 'prev: false', 'next: false',
      'head:', '  - tag: meta', '    attrs:', '      name: robots', '      content: noindex, follow',
    ] : []),
    '---', '',
  ].join('\n');
}
export function stripLeadingTitle(body) {
  return body.replace(/^#\s+[^\n]+\n+/, '');
}
