# Coding

**Reviewed:** September 30, 2026  
**Evidence:** current Systems entries and their cited first-party sources; no new live interoperability test in this reference entry.

Codex and Claude Code are useful starting points because they are recognizable coding Harnesses, but the reference should not make coding semantics universal.

- [OpenAI Codex App Server 0.157.0 entry](openai-codex.md)
- [Anthropic Claude Code CLI 2.1.282 entry](anthropic-claude-code.md)

## Different native lifecycles

The reviewed Codex surface uses durable **threads**, **turns**, **items**, approval requests, and sandbox configuration. The reviewed Claude Code CLI uses **sessions**, tool requests, permission rules/modes, PreToolUse hooks, subagents, and experimental agent teams.

Those concepts answer some similar operator questions but are not interchangeable objects.

## What this comparison illustrates

1. **Workload does not determine one lifecycle.** Two coding Harnesses can expose materially different session, permission, delegation, and evidence semantics.
2. **A Harness can host further specialization.** The Playwright and FireRed entries show domain-specific instructions/tools loaded into coding Harnesses without replacing the host lifecycle.
3. **Interface scope matters more than product branding.** A useful claim names the surface and version, not merely "Codex" or "Claude."

## Limitations

This is an orientation layer over current Systems entries. It adds no product capability findings and does not claim that the two Harnesses have been benchmarked against the same workload.
