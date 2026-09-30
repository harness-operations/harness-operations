# What is Harness Operations?

**Status:** Harness Operations Reference Model 0.4

## The shift

Foundation models have become capable enough to plan, reason, write code, use tools, call APIs, inspect files, browse information, and carry work across multiple steps. But a model alone does not provide the surrounding machinery required to perform that work reliably.

That machinery is commonly described as an **agent harness**: the software around a model that manages some combination of context, tools, execution, permissions, persistence, and the interaction loop that keeps the agent progressing through a task. Current descriptions from Microsoft and Google use similar boundaries, emphasizing tool execution, state or memory, approvals, and multi-step operation.

Harness engineering focuses on making that machinery effective.

As organizations begin to operate more than one harness, a different problem appears. There may be multiple harness products, models, hosts, execution environments, sessions, workflows, permission systems, schedules, budgets, and human approval paths. The challenge is no longer only how to build an effective agent. It is how to operate the resulting agent system coherently.

> **Harness engineering makes agents effective. Harness Operations enables them to work at scale.**

## Definition

**Harness Operations** is the practice of operating one or more agent harnesses as a coherent system across their lifecycles, environments, work, and authorities. It covers observation, coordination, security, governance, resource and usage controls, human intervention, and auditability while preserving each harness's native semantics.

Harness Operations is an operational discipline and reference model. It does not require a central control plane, a particular deployment architecture, or a new wire protocol.

The reference model begins when operating the agents becomes a distinct problem from building the agents.

## Why a harness-centric model?

**AgentOps** and **agent operations** are emerging umbrella terms for practices used to deploy, observe, evaluate, secure, and manage AI agents in production. Current usage ranges from observability and testing to governance, security, cost control, lifecycle management, and fleet operations. Their scope and terminology are not yet standardized, and the v0.1 prior-art review did not identify a broadly adopted common AgentOps specification or reference model.

Harness Operations does not attempt to redefine that broader practice. It deliberately chooses the **Harness** as its primary operational unit because the Harness is where an agent's session lifecycle, context, tools, permissions, execution, persistence, and other native runtime semantics are concretely mediated.

That choice matters in heterogeneous environments. Two agents may appear to perform similar work while the Harnesses operating them expose materially different session lifecycles, capability models, permission mechanisms, execution environments, or persistence semantics. A harness-centric model makes those differences explicit instead of treating every agent as an interchangeable process.

Harness Operations is therefore **adjacent to and overlapping with** broader AgentOps / agent-operations practice while addressing a more specific systems problem: how heterogeneous Harnesses and their executions can be operated coherently without erasing their native meaning.

## When the problem appears

A single harness running one agent session can often be operated manually. The user already knows where the session runs, what it can access, why it exists, and whether it needs attention.

Operational complexity grows when those assumptions stop being obvious.

For example, an environment may include:

- different harnesses selected for different kinds of work;
- local, remote, hosted, or ephemeral Harness Instances;
- multiple simultaneous Agent Sessions;
- workflows spanning more than one Harness Instance;
- scheduled or event-triggered execution;
- different execution environments and trust boundaries;
- distinct capabilities, credentials, network access, and filesystem access;
- human approvals and machine-to-machine delegation;
- limits on cost, tokens, compute, duration, concurrency, or external actions;
- outputs and handoffs that must remain inspectable after execution ends;
- operational decisions that must be attributable and auditable.

At that point, the agent system has operational state of its own. Individual harnesses may remain fully capable and independently useful, but an operator needs a way to reason about the system across them.

## What Harness Operations includes

Harness Operations is broader than multi-agent orchestration. Orchestration is one operational capability within a larger lifecycle.

### Observation

Operators need to know which Harness Instances and Agent Sessions exist, what they are doing, where they are running, what state they are in, and what requires attention.

Observation should preserve meaningful native differences between harnesses instead of flattening unlike states into false equivalence.

### Lifecycle management

Operational systems need to reason about creation, execution, suspension, resumption, interruption, cancellation, completion, failure, and recovery across potentially different harness lifecycles.

### Coordination

Work may involve one session, multiple sessions, reusable workflows, delegated work, or collaboration across independent agents. Harness Operations describes the operational relationships around that coordination without requiring one orchestration mechanism.

### Routing and placement

Different work may be assigned to different harnesses, models, hosts, or execution environments based on capability, availability, cost, trust, policy, or operator preference.

### Security

Harnesses can acquire significant authority through tools, credentials, filesystem access, network access, deployment rights, and external actions. Harness Operations treats context, capability, execution environment, and authority as independently scoped concerns.

A desired rule and a technically enforced boundary are not the same thing. Operational systems should represent that distinction honestly.

### Governance

As agent systems gain autonomy, questions of authority and accountability become operational questions:

- Who owns a workflow or environment?
- Who may grant authority?
- Who may approve a risky action?
- What can be delegated, and for how long?
- Who can create an exception to policy?
- What limits apply?
- Who is accountable for the outcome?

Governance is therefore first-class in Harness Operations and is distinct from both policy definition and technical policy enforcement.

### Human intervention

Human approval, escalation, correction, and termination are normal operational states rather than exceptional failures. A system should make it clear when a human decision is required and what authority that decision grants.

### Resource and usage controls

Agent execution consumes measurable resources. Harness Operations includes observing and controlling limits such as money, tokens, compute, duration, concurrency, storage, and externally visible actions.

### Evidence and auditability

Operators need durable evidence of what happened: resolved configuration, decisions, events, usage, approvals, exceptions, outputs, and other facts required to explain an execution after mutable current state has changed.

## What Harness Operations is not

### Not model serving

Model serving operates inference infrastructure and model endpoints. Harness Operations begins above that layer, where a Harness mediates models through context, tools, execution, permissions, and agent lifecycle.

### Not harness engineering

Harness engineering concerns the design and improvement of the Harness itself: its loop, context management, tools, permissions, memory, verification, and other machinery used to make an agent effective.

Harness Operations concerns how Harnesses and their executions are operated as an ongoing system.

The disciplines are complementary.

### Not a replacement definition for AgentOps

AgentOps and agent operations are emerging, non-uniform terms for operating AI agents in production. Harness Operations overlaps with that practice but does not treat it as a parent specification or standardized reference model.

The Harness Operations scope is more specific: heterogeneous Harnesses, their native runtime semantics, and the operational state needed to run them coherently at scale.

### Not an agent framework

An agent framework provides primitives for constructing agents or agentic applications. A framework may be used to implement a Harness, but Harness Operations does not prescribe how agents are built.

### Not merely orchestration

Orchestration coordinates execution. Harness Operations additionally includes observation, lifecycle management, security, governance, limits, human intervention, and operational evidence.

### Not a replacement for DevOps, SRE, platform engineering, or workflow engineering

Harness Operations inherits many established operational concerns: reliability, isolation, observability, identity, change control, resource management, scheduling, and incident response.

The reference model should reuse those practices rather than rename them. Its narrower focus is the set of operational concerns that arise specifically around heterogeneous agent harnesses, agent sessions, delegated authority, mutable context, autonomous execution, and cross-harness evidence.

### Not a new protocol by default

Reference Model 0.4 intentionally does not define a Harness Operations wire protocol.

Existing standards already address important boundaries in the ecosystem. For example, MCP addresses tool and context integration, ACP defines a client/coding-agent interaction boundary, A2A defines communication between independent agent systems, and OpenTelemetry provides common observability foundations.

Harness Operations should map and compose those standards where appropriate rather than create parallel semantics without a demonstrated interoperability gap.

The detailed boundary analysis belongs in the Standards Landscape document.

## A reference-model lens

Harness Operations 0.4 organizes operational state into three broad categories.

```text
DEFINITION          EXECUTION          EVIDENCE
what should happen  what is happening  what happened
```

### Definition

Intended configuration, workflow, authority, ownership, policy, and limits.

### Execution

Identifiable live or historical execution state: Runs, Agent Sessions, Harness Instances, and Execution Environments.

### Evidence

Artifacts, events, usage, decisions, approvals, exceptions, and audit information that describe what occurred.

The distinction matters because mutable configuration is not historical truth. Changing a model, policy, profile, credential, or workflow after a Run has completed should not silently change the record of how that Run actually executed.

## Why preserve native harness semantics?

Harnesses are independent systems. They may expose different capabilities, state models, permission mechanisms, persistence semantics, execution environments, or collaboration features.

A Harness Operations layer can provide common operational concepts without pretending those differences do not exist.

Normalization is useful only where the semantics are genuinely shared. Elsewhere, preserving native meaning is more truthful and more interoperable than forcing every harness into the same abstraction.

## Relationship to the rest of the reference model

This document introduces the discipline and its scope. The remaining Reference Model 0.4 documents define the details:

- **Principles** — design principles for operating heterogeneous harness systems;
- **Reference Model** — core concepts and relationships;
- **Governance** — authority, policy, delegation, approvals, exceptions, limits, and accountability;
- **Standards Landscape** — mappings and boundaries with existing standards and protocols.

Shared terminology is maintained in [Scope and Terminology](terminology.md).

## Background references

These sources illustrate current use of the agent-harness concept and are background, not normative dependencies of this reference model:

- Microsoft, [Agent Harness](https://learn.microsoft.com/en-us/agent-framework/concepts/harness)
- Google Cloud, [What is an agent harness?](https://cloud.google.com/discover/agent-harness)
- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
