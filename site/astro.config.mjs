import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import { remarkSpecLinks } from './scripts/remark-spec-links.mjs';
import { topics } from './src/lib/guide-topics.mjs';

export default defineConfig({
  site: 'https://harness-operations.com',
  redirects: {
    '/landscape': '/standards/',
    '/apply/mappings/codex-app-server': '/systems/openai-codex/',
    '/apply/mappings/claude-code-cli': '/systems/anthropic-claude-code/',
  },
  markdown: { processor: unified({ remarkPlugins: [remarkSpecLinks] }) },
  integrations: [starlight({
    title: 'Harness Operations',
    description: 'Explore AI-agent capabilities, compare reviewed tools, and find options for your goals.',
    customCss: ['./src/styles/custom.css'],
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/harness-operations/harness-operations' }],
    sidebar: [
      { label: 'Start here', items: [
        { label: 'Help me choose', slug: 'choose' },
        { label: 'Explore capabilities', slug: 'capabilities' },
        { label: 'Browse tools', slug: 'systems' },
        { label: 'Compare tools', slug: 'apply/matrix' },
      ] },
      { label: 'Capabilities', collapsed: true, items: topics.map(({ id, title }) => ({ label: title, slug: `capabilities/${id}` })) },
      { label: 'Explore tools', collapsed: true, items: [
        { label: 'Coding & coordination', collapsed: true, items: [
          { label: 'OpenAI Codex', slug: 'systems/openai-codex' },
          { label: 'Anthropic Claude Code', slug: 'systems/anthropic-claude-code' },
          { label: 'Claude Projects (beta)', slug: 'systems/claude-projects' },
          { label: 'Coding comparison', slug: 'systems/coding-harnesses' },
        ] },
        { label: 'Security & testing', collapsed: true, items: [
          { label: 'Antares models', slug: 'systems/antares-models' },
          { label: 'Antares CLI', slug: 'systems/antares-cli' },
          { label: 'Cisco Foundry Security Spec', slug: 'systems/cisco-foundry-security-spec' },
          { label: 'Playwright Test Agents', slug: 'systems/playwright-test-agents' },
        ] },
        { label: 'Browser, computer & voice', collapsed: true, items: [
          { label: 'Browser Use', slug: 'systems/browser-use' },
          { label: 'Computer Use', slug: 'systems/computer-use' },
          { label: 'Realtime Voice', slug: 'systems/realtime-voice' },
          { label: 'Background Execution', slug: 'systems/background-execution' },
        ] },
        { label: 'Creation & evaluation', collapsed: true, items: [
          { label: 'FireRed-OpenStoryline', slug: 'systems/firered-openstoryline' },
          { label: 'Agent Evaluation', slug: 'systems/agent-evaluation' },
        ] },
      ] },
      { label: 'How things work', collapsed: true, items: [
        { label: 'Operating arrangements', slug: 'systems/operating-arrangements' },
        { label: 'Standards and boundaries', slug: 'standards' },
        { label: 'Glossary', slug: 'glossary' },
        { label: 'An approval pattern', slug: 'apply/patterns/approval-valid-at-execution-time' },
        { label: 'Stop and recover', slug: 'apply/patterns/stop-revoke-and-recover' },
        { label: 'Model-informed decisions', slug: 'apply/patterns/model-informed-decisions' },
        { label: 'Worked handoff example', slug: 'apply/example' },
      ] },
      { label: 'About', items: [
        { label: 'About this project', slug: 'about' },
        { label: 'How evidence is reviewed', slug: 'apply/comparison-methodology' },
        { label: 'Contribute an entry', slug: 'systems/template' },
        { label: 'Community', link: 'https://github.com/harness-operations/harness-operations/issues' },
        { label: 'Releases', link: 'https://github.com/harness-operations/harness-operations/releases' },
      ] },
    ],
  })],
});
