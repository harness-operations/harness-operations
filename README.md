# Harness Operations

This repository is the canonical home of the emerging **Harness Operations Reference Model**.

**Status:** Harness Operations Reference Model 0.4.

> **Harness engineering makes agents effective. Harness Operations enables them to work at scale.**

Harness Operations is a vendor-neutral, implementation-neutral, **harness-centric** reference model for operating one or more agent harnesses as a coherent system across their lifecycles, environments, work, and authorities.

`AgentOps` and `agent operations` are emerging umbrella terms for practices used to deploy, observe, evaluate, secure, and manage AI agents in production. Their scope and terminology are not yet standardized, and the v0.1 prior-art review did not identify a broadly adopted common AgentOps specification or reference model. Harness Operations is adjacent to and overlapping with that practice, but addresses a more specific systems problem: operating heterogeneous Harnesses and their executions coherently without erasing their native session, context, capability, permission, execution, governance, and persistence semantics.

The project intentionally starts with a reference model rather than a new wire protocol. Existing standards, established operational disciplines, and native Harness capabilities should be composed where they already solve the problem.

## Reference Model 0.4

Canonical reference material lives under [`reference/`](reference/):

1. [What is Harness Operations?](reference/overview.md)
2. [Principles](reference/principles.md)
3. [Reference Model](reference/model.md)
4. [Governance](reference/governance.md)
5. [Standards Landscape](reference/landscape.md)

Shared scope and vocabulary are maintained in [Scope and Terminology](reference/terminology.md).

## Scope

Reference Model 0.4 is descriptive. It does **not** define:

- a Harness Operations wire protocol;
- a common Harness or Agent Session lifecycle;
- a registry or SDK;
- a conformance or certification program;
- a centralized control-plane requirement;
- a replacement for MCP, ACP, A2A, OpenTelemetry, AgentOps, DevOps/SRE, or native Harness interfaces.

The reference model should become smaller when an existing standard or established discipline already expresses a concern faithfully.

## Development process

Substantive design work begins in GitHub Issues and canonical reference material changes through Pull Requests.

- [Reference Model v0.4 release](https://github.com/harness-operations/specification/issues/48)
- [Reference Model v0.1 release](https://github.com/harness-operations/specification/releases/tag/v0.1)
- [Contribution guide](CONTRIBUTING.md)
- [Proposals](proposals/)

The five foundational documents form the stable reference-model core. Reference Model 0.4 adds Code Mode as generic cross-cutting tool-use prior art and preserves the project's no-new-protocol and no-conformance posture.

## License

Specification and reference content in this repository is licensed under the [Apache License 2.0](LICENSE).
