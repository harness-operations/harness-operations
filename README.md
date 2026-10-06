# Harness Operations

This repository is the **canonical reference for Harness Operations**: the discipline of operating agent harnesses in real systems, individually or together.

> **Understand how agent harnesses work—on their own and together.**

Agent harnesses are used for different kinds of work and expose different execution loops, state models, tools, permissions, deployment boundaries, artifacts, and cooperation mechanisms. This project documents those differences in their native terms before trying to normalize them.

The Systems reference may therefore include more than Harnesses themselves. A model, skill package, tool interface, tool service, execution runtime, client, application, control layer, or domain-specific specification may be relevant when it materially clarifies how agent work is executed or operated. Inclusion does **not** make every subject a Harness or imply that unlike systems should be ranked as direct competitors.

The project also publishes the Harness Operations Reference Model as a deeper conceptual lens for implementation and analysis. It should help explain real systems without becoming a prerequisite for understanding concrete systems or forcing every system into one architecture.

## Start with Systems

- [Systems](systems/) — canonical reference entries for concrete Harnesses and adjacent systems in their native terms.
- [System comparison methodology](comparisons/methodology.md) — how scoped capabilities, evidence, freshness, and interoperability observations are recorded.
- [Operating arrangements](systems/operating-arrangements.md) — recurring ways Harnesses work independently and together.
- [Standards and Boundaries](reference/standards.md) — boundaries with MCP, ACP, A2A, OpenTelemetry, Code Mode, and adjacent standards or practices.

A system can be valuable because it operates independently, because it specializes another Harness, because it participates in a larger workflow, or because it exposes a useful boundary to other systems. These are operating arrangements, not maturity levels.

## Reference material

The Reference Model remains available as deeper material:

1. [What is Harness Operations?](reference/overview.md)
2. [Principles](reference/principles.md)
3. [Reference Model](reference/model.md)
4. [Governance](reference/governance.md)
5. [Standards and Boundaries](reference/standards.md)

Shared scope and vocabulary are maintained in [Scope and Terminology](reference/terminology.md).

## Scope

Harness Operations does **not** define or require:

- a universal Harness architecture or lifecycle;
- a single Agent Session, Run, workflow, or control-plane model;
- a Harness Operations wire protocol, registry, or SDK;
- a universal maturity ladder, weighted product ranking, or security grade;
- a replacement for MCP, ACP, A2A, OpenTelemetry, AgentOps, DevOps/SRE, or native Harness interfaces;
- a generic directory of products that merely contain an LLM.

The inclusion rule for Systems is narrower: a subject should teach something material about agent execution, specialization, operation, coordination, evidence, or failure behavior.

The reference material should become smaller when an existing standard or established discipline already expresses a concern faithfully.

## Development process

Substantive design work begins in [GitHub Issues](https://github.com/harness-operations/specification/issues) and canonical content changes through Pull Requests.

Published releases remain immutable. New Systems, specification, assessment, and benchmark work must preserve the scope and evidence of earlier releases rather than reinterpret them retroactively.

- [Contribution guide](CONTRIBUTING.md)
- [Releases](https://github.com/harness-operations/specification/releases)

## License

Specification and reference content in this repository is licensed under the [Apache License 2.0](LICENSE).
