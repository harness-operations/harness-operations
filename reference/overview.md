# What is Harness Operations?

## The shift

A capable model is only one part of an operational agent. The surrounding software commonly called an **agent harness** manages some combination of context, tools, execution, permissions, persistence, verification, and the interaction loop that keeps the agent progressing through work.

Harness engineering focuses on making that machinery effective.

Harnesses are then applied to very different kinds of work. Some are general-purpose environments. Others are narrow specialists. A domain-specific agent may run inside a general Harness through instructions and tools, while another product owns its own execution loop, sandbox, state, and user interaction. A larger application may coordinate several agent roles plus non-agent infrastructure.

Those systems should not be forced into one architecture simply because they all contain an agent loop.

> **Understand how agent harnesses work—on their own and together.**

## Definition

**Harness Operations** is the discipline of operating agent harnesses in real systems—individually or together—while preserving the native semantics that matter to their work.

It covers questions such as:

- what kind of work a Harness is intended to perform;
- where its agent loop, state, tools, credentials, and execution actually live;
- what the Harness can affect and what constrains those effects;
- how operators observe, interrupt, approve, recover, or explain work;
- what completion means for the workload;
- what evidence survives after execution;
- how a Harness operates independently or cooperates with other systems.

Using more than one Harness is **not** a prerequisite. The same operational questions can matter for one local or hosted Harness with consequential tools, persistent state, external effects, or recovery behavior.

## Why start with concrete systems?

Different systems specialize at different layers.

Specialization may live in model weights, instructions, skills, tools, a dedicated Harness, an execution runtime, or a larger application composed of agents and deterministic infrastructure. Two products in the same domain may therefore expose very different operational boundaries, while the same Harness may support workloads from several domains.

This project starts by describing the concrete system in its own terms:

1. what the subject actually is;
2. what workload it serves;
3. where the agent loop and execution boundaries live;
4. what state, capabilities, artifacts, and controls it exposes;
5. how it works alone or with other components;
6. what the available evidence does and does not establish.

Only after that description should shared concepts be used where they genuinely clarify the comparison.

> **Normalize the operator's questions; preserve the native answers.**

## What the project publishes

### Systems

[Systems](../systems/) is the canonical concrete reference for Harnesses and adjacent components in their native terminology. An entry may cover a Harness, model, tool interface, tool service, skill package, execution runtime, client, application, control layer, or domain-specific architecture when doing so materially clarifies agent operation.

A reference entry is not automatically a requirements assessment, endorsement, compatibility claim, or proof that the subject is itself a Harness.

### Operating patterns

Patterns describe recurring ways agent work is performed or handed across boundaries, for example:

- standalone bounded execution;
- interactive supervised work;
- specialization hosted inside another Harness;
- one agent or Harness invoked as a tool by another;
- durable artifact handoffs;
- shared-state or queue-based workers;
- independent systems communicating across an explicit interface.

These are descriptive arrangements, not a maturity ladder.

### Structured comparisons

Version-scoped observations record concrete capabilities, delivery mechanisms, evidence, freshness, and tested integrations. Unknown is distinct from unsupported, and a documented relationship is distinct from demonstrated interoperability.

### Standards and boundaries

Existing standards already define important parts of the ecosystem. Harness Operations maps where standards such as MCP, ACP, A2A, and OpenTelemetry apply rather than inventing parallel semantics by default.

### Reference material

The Harness Operations Reference Model remains a deeper conceptual lens for implementation and analysis. Its concepts should help explain real systems where they fit without erasing native lifecycles, permission models, execution boundaries, or domain-specific meanings.

A separately scoped implementation specification or use-case profile may add normative requirements, but it does not make the descriptive Reference Model itself a conformance specification.

## Operational questions across workloads

The answers vary by workload, but recurring questions include execution and state, capabilities and effects, authority and intervention, limits and resource use, completion and quality, failure and recovery, and evidence.

The important constraint is that these questions do not require one universal answer. A coding task, security evaluation, testing workflow, research process, and creative edit can legitimately have different native lifecycles and definitions of completion.

## What Harness Operations is not

### Not a generic AI-tool directory

A subject belongs because it exposes a distinct or instructive operational design, boundary, specialization mechanism, coordination pattern, or failure mode—not merely because it uses an LLM.

### Not model serving

Model serving operates inference infrastructure and model endpoints. Harness Operations focuses on the surrounding system that turns model calls into operational agent work and on the boundaries to adjacent components.

### Not harness engineering

Harness engineering improves the machinery that makes an individual agent effective. Harness Operations concerns how that machinery behaves in real use, how it is operated, and how it composes with other systems.

The disciplines are complementary.

### Not a replacement definition for AgentOps

AgentOps and agent operations are emerging, non-uniform terms for operating AI agents in production. Harness Operations overlaps with that practice while taking a narrower, Harness-centric view of concrete runtime and operational boundaries.

### Not an agent framework or orchestration engine

A framework may be used to build a Harness. Orchestration may coordinate agents. Harness Operations does not prescribe either, and cooperation is only one part of the systems reference.

### Not a centralized-control requirement

Local, embedded, ephemeral, hosted, peer-to-peer, federated, and centrally managed arrangements can all be valid operating arrangements.

### Not a new protocol by default

Existing standards should be composed where they already solve the relevant problem. New interoperability semantics should follow demonstrated gaps rather than precede them.

## The Reference Model as a deeper lens

The Reference Model distinguishes three broad operational lenses:

```text
DEFINITION          EXECUTION          EVIDENCE
what should happen  what is happening  what happened
```

These concepts can be useful when comparing systems, especially where mutable configuration, live execution, and historical evidence must remain distinguishable.

They are not mandatory storage partitions, object names, or a universal lifecycle. A system reference entry should describe the subject's native concepts first and map to the Reference Model only where the mapping clarifies rather than distorts.

## Background references

These sources illustrate current use of the agent-harness concept and are background, not normative dependencies:

- Microsoft, [Agent Harness](https://learn.microsoft.com/en-us/agent-framework/concepts/harness)
- Google Cloud, [What is an agent harness?](https://cloud.google.com/discover/agent-harness)
- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
