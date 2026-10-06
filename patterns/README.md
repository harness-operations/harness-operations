# Operational Patterns

**Status:** Applied Harness Operations v0.5

These patterns turn the Harness Operations reference model into practical operational guidance.

They are not protocol requirements, conformance rules, or universal implementation recipes. Each pattern describes a problem, the assumptions under which a control is meaningful, relevant native mechanisms, expected failure behavior, useful evidence, and known limitations.

Initial patterns:

1. [Approval valid at execution time](approval-valid-at-execution-time.md)
2. [Stop, revoke, and recover](stop-revoke-and-recover.md)
3. [Model-informed decisions, code-enforced consequences](model-informed-decisions.md)

The patterns are grounded in:

- the deterministic [approved-artifact handoff example](../examples/approved-artifact-handoff/README.md);
- the reviewed [OpenAI Codex entry](../systems/openai-codex.md);
- the reviewed [Anthropic Claude Code entry](../systems/anthropic-claude-code.md).

Implementation-specific mechanisms remain native to those systems. The patterns describe the operational properties to preserve, not a common wire format.
