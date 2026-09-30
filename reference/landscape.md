# Standards Landscape and Interoperability Boundaries

**Status:** Harness Operations Reference Model 0.4

**External-claim verification:** Existing standards last verified September 25, 2026; Code Mode section verified September 30, 2026

## Purpose

Harness Operations does not begin from an empty standards or operational landscape.

Existing protocols already define important boundaries around AI applications, coding agents, independent agent systems, tools, context, tasks, artifacts, permissions, and telemetry. Existing operational disciplines already cover many production concerns. Harness Operations should compose those standards and practices rather than rename or replace them.

This document asks a narrower question:

> **Which existing standards and adjacent disciplines already define relevant boundaries, and what harness-specific operational problem remains?**

The landscape is intentionally selective. It is not a catalog of agent frameworks, products, or every protocol related to AI systems.

### Implementation prior-art inclusion rule

A concrete implementation or product belongs in this landscape only when its public interface or design materially clarifies a cross-harness operational boundary that the reference model needs to reason about.

Inclusion:
- does **not** imply endorsement, recommendation, or required compatibility;
- does **not** promote implementation-specific objects into universal Harness Operations concepts;
- should prefer public, inspectable interfaces and documentation over marketing claims;
- should be revisited when the implementation changes materially or stops adding distinct conceptual value.

Open standards remain preferable reference points when they faithfully define the same boundary.

## Guiding rule: compose before inventing

Harness Operations should prefer this order:

1. use a native Harness capability when it already expresses the required semantics;
2. use or map an established open standard where it defines the relevant boundary;
3. reuse established operations, security, and governance practice rather than renaming it;
4. adapt between different native or standardized semantics without erasing meaningful differences;
5. propose new interoperability semantics only when a demonstrated cross-harness gap remains.

Reference Model 0.1 therefore does not define a Harness Operations wire protocol.

## Boundary map

```text
                         Operators
                            │
                  Harness Operations model
             lifecycle · governance · evidence
               routing · limits · intervention
                            │
           ┌────────────────┼────────────────┐
           │                │                │
           ▼                ▼                ▼
      coding client     control layer    other clients
           │                                 │
          ACP                         native Harness APIs
           │                                 │
           ▼                                 ▼
       Harness / agent systems / Harness Instances
           │                │                │
           ├──── MCP ───────┼──► tools, context, services
           │                │
           ├──── A2A ───────┼──► independent agent systems
           │                │
           └── telemetry ───┴──► OpenTelemetry
```

This diagram is illustrative, not a required architecture. A Harness Operations system may use none, one, or several of these standards.

## AgentOps and broader agent operations

`AgentOps` and `agent operations` are emerging umbrella terms for production practices around AI agents. Current usage is materially non-uniform:

- some usage centers observability, testing, debugging, evaluation, and cost tracking;
- some expands into deployment, lifecycle management, governance, security, and fleet operations;
- vendors and research use the term with different boundaries.

Examples include AWS's broad AgentOps operational framing, the AgentOps product/project's observability and evaluation tooling, and research using AgentOps as an observability taxonomy.

Background:

- [AWS: AgentOps — operationalize agentic AI at scale](https://aws.amazon.com/blogs/machine-learning/agentops-operationalize-agentic-ai-at-scale-with-amazon-bedrock-agentcore/)
- [AgentOps documentation](https://docs.agentops.ai/v2/introduction)
- [AgentOps: Enabling Observability of LLM Agents](https://arxiv.org/abs/2411.05285)

### Relationship to Harness Operations

The v0.1 prior-art review did **not** identify a broadly adopted common AgentOps specification or reference model. Harness Operations therefore does not treat AgentOps as a parent specification, standardized taxonomy, or authoritative model that Harness Operations must fit inside.

Harness Operations is **adjacent to and overlapping with** broader AgentOps / agent-operations practice while addressing a more specific systems problem.

The Harness is the primary operational unit because it concretely mediates session lifecycle, context, tools, permissions, execution, persistence, and other runtime semantics. This matters when operators work across Harnesses that expose materially different session models, permission mechanisms, capabilities, execution environments, or persistence behavior.

Harness Operations is not an attempt to own the phrase “agent operations.” Its purpose is to provide a coherent model for operating heterogeneous Harnesses and their executions without erasing those native differences.

## Model Context Protocol (MCP)

### Current scope

The Model Context Protocol is an open standard connecting AI applications to external systems that expose tools, resources, prompts, and related capabilities.

The current MCP specification revision, **2026-07-28**, uses a stateless request/response core with a formal extension mechanism. Long-running work is available through the **Tasks extension**, which is currently marked **Draft**.

Authoritative background:

- [MCP 2026-07-28 specification release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [MCP specification](https://modelcontextprotocol.io/specification/2026-07-28)

### Relationship to Harness Operations

MCP can provide tool and service Capabilities, external context and resources, authorization boundaries, long-running Tasks, and capability/extension discovery.

Harness Operations should use those semantics where MCP is the actual integration boundary. An MCP Task may serve as a Run when its lifecycle already supplies the operational identity required.

Harness Operations should not create parallel wire semantics for MCP tools, resources, prompts, authorization, Tasks, or capability discovery.

MCP does not by itself define the complete operational model for heterogeneous Harness Instances across unrelated Harnesses: cross-harness lifecycle, placement, Authority and Delegation, human intervention, Limits, and historical execution evidence remain separate concerns.

MCP is evolving quickly. These boundaries are time-sensitive and should shrink if MCP absorbs them successfully.

## Code Mode

**Section verification:** September 30, 2026.

### Scope

**Code Mode** is a tool-use pattern in which a model writes executable code that calls tools or APIs, composes operations, and processes intermediate results before returning selected output to the model. Control flow such as loops, conditions, batching, and result filtering can run in code without another model inference for every underlying operation.

Harness Operations uses **Code Mode** generically. It is not the name of a required vendor product, an additional Harness, or a new interoperability protocol. A general-purpose code interpreter, tool-search feature, or shell command alone does not establish this pattern; the relevant behavior is code-mediated orchestration of the tools or APIs available to the agent.

### Origins and adoption

Cloudflare publicly introduced its **Code Mode** framing and an Agents SDK implementation on **September 26, 2025**, describing generated TypeScript that calls MCP-backed APIs. We credit that named introduction rather than claiming Cloudflare invented every use of executable code as an agent action: earlier research, including **CodeAct (ICML 2024)**, already explored code-based action composition.

- [Cloudflare: Code Mode, September 26, 2025](https://blog.cloudflare.com/code-mode/)
- [CodeAct: Executable Code Actions Elicit Better LLM Agents, ICML 2024](https://proceedings.mlr.press/v235/wang24h.html)

The pattern is no longer specific to Cloudflare. It appears across agent harnesses, model-platform interfaces, and MCP tooling, under Code Mode and related names such as programmatic tool calling. These first-party examples establish adoption at different surfaces, not universal native support in every product from a vendor:

| Implementation example | Documented execution surface | Scope to preserve |
| --- | --- | --- |
| [Cloudflare Code Mode](https://developers.cloudflare.com/agents/tools/codemode/) | Generated code orchestrates configured tools in an execution environment; [MCP server variants](https://developers.cloudflare.com/agents/model-context-protocol/codemode/) expose code execution to clients. | Distinguish harness/client-side integration from execution owned by the MCP server. |
| [Goose Code Mode](https://goose-docs.ai/docs/guides/managing-tools/code-mode/) | An enabled built-in extension supports on-demand discovery and programmatic calls to tools from other extensions. | This is a documented harness extension; availability and configuration belong to the reviewed build. |
| [Codex code-mode tool adaptation](https://github.com/openai/codex/blob/67727e7cf114cf3e1b71db368d74b24e32f6cb12/codex-rs/tools/src/code_mode.rs) | Inspected revision `67727e7` adapts function, freeform, and namespaced tool definitions for the code-mode runtime. | Source-backed harness integration, not a live compatibility test. The [configuration reference](https://developers.openai.com/codex/config-reference/) describes `features.code_mode.enabled` as under development and off by default; do not infer availability across all Codex surfaces. |
| [Pi MCP and Code Mode](https://pi.dev/docs/latest/mcp) | The built-in integration, introduced in [Pi 0.99.0 on September 29, 2026](https://pi.dev/changelog), runs model-written JavaScript in QuickJS and makes MCP tools callable from scripts. | Review the built-in integration and its configuration; replacement extensions or SDK embeddings can expose different behavior. |
| [Anthropic programmatic tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) | Model-written Python invokes configured tools through a code-execution container and processes intermediate results. | This is a Claude API feature, not a blanket claim about every Claude Code CLI, SDK, or hosted surface. |
| [OpenAI API programmatic tool calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) | Hosted JavaScript orchestrates eligible tools in an isolated V8 runtime. | This is a model-platform API surface, separate from Codex. In the Responses API, `allowed_callers` controls invocation paths; the application still executes client-owned function calls. |
| [FastMCP CodeMode](https://gofastmcp.com/servers/transforms/code-mode) | A server transform exposes discovery and sandboxed Python execution over existing tools. | This is server-side tooling; a connecting MCP client need not implement the code runtime itself. |

These are documentation- or source-backed examples, not Harness Operations live compatibility tests. Shared naming does not imply identical languages, discovery APIs, sandbox guarantees, approval handling, persistence, replay, or cancellation behavior. Maturity is implementation-specific; there is no single Code Mode protocol version to adopt.

### Relationship to MCP and native interfaces

Code Mode changes how an agent composes operations, not necessarily how those operations are transported or authorized. It can use MCP tools, native APIs, or application-provided functions. It neither requires nor replaces MCP. Where MCP is the actual boundary, its native tool, authorization, and lifecycle semantics remain relevant.

A harness may implement Code Mode itself or consume a Code Mode service through an ordinary tool interface. Therefore, **using a Code Mode MCP server is not evidence that the client has native Code Mode support**. On-demand discovery is a common complement, but is distinct from executing a program that orchestrates calls.

Pi illustrates automatic tool adaptation rather than server conversion. Its [built-in MCP configuration](https://pi.dev/docs/latest/mcp#control-tool-exposure) defaults to `codemode` exposure and activates code mode when a server with that exposure connects, unless `autoEnableCodemode` is disabled. Tools registered as `mcp__<server>__<tool>` become discoverable and callable from scripts through the MCP integration. The server still speaks MCP; automatic exposure does not grant additional downstream Authority.

Reducing model round trips or filtering results can save context, but does not establish a universal performance improvement. For example, [Goose's implementation account](https://goose-docs.ai/blog/2025/12/21/code-mode-doesnt-replace-mcp/) describes discovery and code-generation overhead for simpler tasks. Cost and latency claims need workload-specific measurements.

### Relationship to Harness Operations

The operational concern is that **one outer code-execution request can contain many separately consequential actions**. Mapping that request as a single successful tool call can hide the authority, failures, resource use, and evidence of the operations inside it.

An integration should distinguish:

- **Execution identity and context:** correlate the generated program, its runtime and configuration, and underlying calls with the native Agent Session or broader Run. Do not create a new Run merely because code executed.
- **Discovery and invocation exposure:** distinguish direct model declarations, discovery, and code-callable tools. Preserve native direct-only, excluded, or other invocation restrictions at the callable boundary. Absence from current model declarations is not evidence of revocation; presence in a program's tool interface does not grant Authority for each attempted action.
- **Authority and enforcement:** apply the relevant scope, approval conditions, and revocation state at protected operations. Permission to start a program is not automatically permission for every call it can attempt. Keep isolation of generated code separate from authorization of downstream effects.
- **Evidence and data handling:** retain enough provenance for material calls, decisions, targets, and outcomes to explain what happened. A final summary need not contain every intermediate result, but it should not be the only audit evidence. Minimize sensitive payload retention and disclose redaction or missing evidence.
- **Limits and credentials:** identify the actual runtime and tool-call boundaries for time, memory, concurrency, call count, downstream consumption, credential access, and egress. A single outer request is not a meaningful limit on the number of inner operations.
- **Partial completion and recovery:** distinguish stopping code from stopping already-issued calls. Record effects that completed before denial, expiry, cancellation, or disconnect. Retry and replay need operation-specific reconciliation or idempotency; neither rollback nor exactly-once effects follow from executing a program.

Native exposure controls differ. [Codex configuration](https://developers.openai.com/codex/config-reference/) distinguishes direct-only and excluded namespaces; the [OpenAI API](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) distinguishes direct and programmatic callers; [Pi extensions](https://pi.dev/docs/latest/extensions#tool-exposure) can mark a tool `model-only`, excluding nested invocation. These illustrate separate invocation paths, not equivalent policy models.

Implementations may already provide some of these controls. For example, [Cloudflare's durable runtime](https://developers.cloudflare.com/agents/tools/codemode/durable-runtime/) documents execution history, approval pauses, replay-based continuation, and connector-dependent compensation; [FastMCP](https://gofastmcp.com/servers/transforms/code-mode#tool-call-limits) documents a separate bound on calls inside one execution. Preserve those native mechanisms rather than attributing their guarantees to Code Mode in general.

Pi's [MCP permissions documentation](https://pi.dev/docs/latest/mcp#permissions) describes a shared extension tool pipeline, including configured permission handlers, and `parentToolCallId` correlation for code-mode calls. Its [extension contract](https://pi.dev/docs/latest/extensions#tools) permits `isError` results that still supply structured data to scripts, and stores bounded `nestedCalls` records without returned result payloads; `complete: false` marks omitted record information. These mechanisms illustrate why inner outcomes and evidence completeness remain distinct from outer program completion. They do not establish complete auditing or a universal authorization policy.

Programs can also invoke decision models. [Pi's introduction](https://earendil.com/posts/you-said-no-mcp/) combines MCP access and Jev classification. Treat such results as [model-informed decision inputs](../patterns/model-informed-decisions.md), not Authority. Code-level control flow does not make a classifier's judgment correct or deterministic; material model calls and their resource use belong in the program's operational evidence alongside tool calls.

Code Mode does not make model-generated choices correct, supply governance Authority, eliminate prompt injection or data-exfiltration risks, or make external systems deterministic. Typed interfaces and code-level control flow are not substitutes for independently enforced policy.

## Agent Client Protocol (ACP)

### Current scope

The Agent Client Protocol standardizes communication between code editors or interactive clients and coding agents. ACP includes session lifecycle, prompts and updates, tool-call presentation, permission requests, configuration, and related coding-agent interactions.

As of the Reference Model 0.3 verification on September 25, 2026, **ACP v1 remains stable** while protocol v2 remains explicitly unstable/draft. The current ACP changelog is at **1.9.1**.

Authoritative background:

- [ACP repository](https://github.com/agentclientprotocol/agent-client-protocol)
- [ACP changelog](https://github.com/agentclientprotocol/agent-client-protocol/blob/main/CHANGELOG.md)

### Relationship to Harness Operations

Where a Harness is exposed through ACP:

- ACP Session semantics can map to Harness Operations Agent Session;
- ACP permission interactions can provide execution-control or Approval inputs depending on governance meaning;
- ACP updates can contribute Events and state;
- the client can act as an operational interface without becoming a universal Control Plane.

Harness Operations should preserve ACP Session semantics rather than force a common lifecycle. A broader Run is useful only when the operational objective extends beyond an individual ACP Session.

## Agent2Agent Protocol (A2A)

### Current scope

A2A is an open standard for communication and interoperability between independent, potentially opaque agent systems.

A2A **1.0** defines normative concepts including `AgentCard`, `Message`, `Task`, `Artifact`, streaming, push notifications, and extensions. The current protocol changelog includes **1.0.1** specification fixes while remaining in the 1.0 protocol family.

Authoritative background:

- [A2A Protocol Specification](https://github.com/a2aproject/A2A/blob/main/docs/specification.md)
- [A2A changelog](https://github.com/a2aproject/A2A/blob/main/CHANGELOG.md)

### Relationship to Harness Operations

A2A is relevant when one Harness or agent system delegates to or collaborates with another independent system.

Possible mappings include:

- AgentCard capabilities and skills informing Capability or routing decisions;
- an A2A Task serving as a Run when the lifecycle scopes are equivalent;
- several A2A Tasks participating in a broader Run when one operational objective spans multiple Tasks, Harnesses, or Approvals;
- an A2A Artifact mapping directly to a Harness Operations Artifact when A2A is the producing boundary.

A2A's normative Task, Message, and Artifact semantics remain authoritative when A2A is used. Harness Operations should add operational relationships or provenance rather than redefine them.

## Agent Executor (AX)

### Current scope

**Agent Executor (AX)** is Google's open-source agentic orchestration runtime for executing agent workloads declaratively at scale.

AX currently exposes `ax.io/v1alpha1` resources centered on four primitives:

- `Task` for sandboxed execution with CPU and memory limits, lifecycle state, and suspend/resume;
- `Workspace` for preparing repositories, MCP servers, skills, and other task dependencies;
- `Gateway` for network policy, egress restrictions, and credential mediation;
- `Model` for model configuration and associated credentials.

AX runs on Agent Substrate and is designed around long-lived, stateful, bursty agent workloads rather than assuming ordinary stateless services or run-to-completion batch jobs.

Authoritative background:

- [Agent Executor](https://agentexecutor.io/)
- [google/ax](https://github.com/google/ax)
- [Google Cloud: Introducing Agent Executor](https://cloud.google.com/blog/products/ai-machine-learning/agent-executor-googles-distributed-agent-runtime)

### Maturity

AX is important emerging runtime prior art, but its current API is explicitly **v1alpha1**. The project warns that its core concepts, protocols, and specifications are still being refined and may introduce major breaking changes before a stable release.

Harness Operations should therefore treat AX as a concrete implementation and design reference, not as a stable cross-vendor standard that other Harnesses must implement.

### Relationship to Harness Operations

AX operates primarily at the execution and orchestration layer. Its concepts can map naturally into the Harness Operations reference model without becoming universal Harness Operations objects:

- an AX `Task` may serve as a Run when its lifecycle matches the operational objective, or may represent one execution inside a broader Run;
- AX task sandboxing and resource controls are concrete Execution Environment and Limit mechanisms;
- a `Workspace` can contribute resolved execution context and Capabilities;
- a `Gateway` can enforce network and credential policy at an execution boundary;
- a `Model` is resolved execution configuration rather than a replacement for Harness identity.

AX is especially useful prior art for suspend/resume, isolation, placement, resource controls, network fencing, and declarative fleet operation.

It does not by itself define the complete cross-harness governance and evidence model described by Harness Operations. Authority, Approval, Delegation, Ownership, cross-system audit evidence, and semantic interoperability across unrelated Harnesses remain separate concerns.

Harness Operations implementations integrating AX should preserve AX's native lifecycle and resource semantics rather than flatten them into a generic executor API.

AX manifests describe intended configuration. A Harness Operations integration should distinguish those declarations from effective runtime state and retain evidence of material sandbox, network-policy, resource-limit, and configuration facts when they matter to later audit or reconstruction. A declared boundary is not by itself proof that enforcement occurred.

## Jev and System One decision models

### Current scope

**Jev** is TypeSafe AI's first **System One** model: a model designed to turn unstructured or structured state into typed probabilistic decisions that software can consume directly.

The current TypeSafe API exposes three decision primitives:

- `Noul` for yes/no judgments expressed as probabilities;
- `Choice` for selecting among a bounded set of options with a probability distribution;
- `Score` for assigning a position on an ordered scale with associated probabilities/confidence.

Unlike a chat-oriented LLM interface, Jev does not return arbitrary free-form text. The caller specifies the question type and allowed answer structure, which constrains output shape and makes the result directly consumable by code.

Authoritative background:

- [TypeSafe AI](https://typesafe.ai/)
- [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe API](https://api.typesafe.ai/docs)

### Maturity

Jev is currently **early access**, and the public TypeSafe API is version **0.2.0** as of this landscape update.

Harness Operations should therefore treat Jev and the broader System One framing as emerging decision-model prior art rather than a stable cross-vendor decision protocol.

### Relationship to Harness Operations

Jev is relevant to Harness Operations because many operational actions depend on model-informed judgments: routing work, escalating to humans, selecting an execution path, evaluating risk, or deciding whether a proposed action should proceed.

A Jev result can provide a typed, probabilistic input to those decisions, but the result is **not itself enforcement**.

For example:

- a `Choice` can inform routing among Harnesses or execution paths;
- a `Score` can contribute to a risk, urgency, quality, or review threshold;
- a `Noul` can contribute to a gate such as whether human review is required;
- confidence or probability can be incorporated into Policy, Limits, or escalation logic.

The surrounding Harness, Control Plane, policy engine, or application remains responsible for interpreting the result and binding it to an operational consequence.

This distinction is important:

```text
Jev / decision model
  What does the model judge, with what probability?

Policy / governance
  What should happen given that judgment?
  Who is authorized to define or override that rule?

Enforcement
  What mechanism actually causes or prevents the action?
```

Typed model output can reduce output-shape ambiguity and make decision inputs easier to validate, log, and audit. It does not by itself guarantee that the judgment is correct, well-calibrated, robust to adversarial or poisoned input, or that a downstream agent will obey it or an operational boundary will be technically enforced.

Harness Operations should preserve that separation rather than treating structured model output as equivalent to Authority, Approval, Policy, or enforcement.

## OpenTelemetry

### Current scope

OpenTelemetry provides vendor-neutral APIs, SDKs, protocols, and semantic conventions for traces, metrics, logs, events, and related observability data.

The dedicated OpenTelemetry GenAI semantic-conventions project currently marks its conventions as **Development** and covers model calls, agent invocation, workflow invocation, planning, tool execution, memory operations, metrics, and events.

Authoritative background:

- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
- [OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai)

### Relationship to Harness Operations

OpenTelemetry should be the first place to look when implementations need common telemetry representation.

A Harness Operations Run is not required to equal an OpenTelemetry trace. A Run may outlive telemetry retention, span several traces, include human Approval intervals, or aggregate systems whose trace contexts are not continuous.

Similarly, Harness Operations Event is an abstract operational occurrence, not a competing OpenTelemetry event schema. Implementations should map applicable telemetry to OpenTelemetry rather than invent a second generic telemetry standard.

## Open Agent Management Protocol (OpAMP)

OpenTelemetry also defines the **Open Agent Management Protocol (OpAMP)**, currently Beta.

Despite the name, OpAMP's “Agents” are data-collection/telemetry agents such as collectors and log forwarders, not AI agent Harnesses. It is not an AI-agent interoperability standard.

It is nevertheless valuable fleet-management prior art. OpAMP includes stable instance identity, capability negotiation, health reporting, heartbeats, effective versus remote configuration, partial interoperability, local restrictions on remote configuration, and package/update state.

Authoritative background:

- [Open Agent Management Protocol](https://opentelemetry.io/docs/specs/opamp/)

Harness Operations does not map AI Agent Sessions or Harness Instances directly to OpAMP Agents. The value is in the operational lessons: capability negotiation, effective-versus-desired configuration, local restrictions, instance identity, health, and explicit partial support.

## Native Harness APIs and protocols

Open standards are not the only valid operational surfaces.

Harnesses may expose native CLIs, APIs, event streams, local stores, plugins, permission mechanisms, or SDKs that carry richer semantics than any common protocol. Harness Operations treats those native interfaces as first-class inputs.

A faithful native capability is preferable to a lossy common abstraction when no applicable standard exists. Interoperability should not require semantic erasure.

## Boundary summary

| Boundary or concern | Existing standard / discipline / surface | Harness Operations relationship |
| --- | --- | --- |
| Broad production operation of AI agents | AgentOps / agent operations | Adjacent and overlapping emerging practice; no broadly adopted common specification identified in v0.1. |
| AI application ↔ tools/context/services | MCP | Compose MCP primitives and extensions; do not redefine tool/resource/task semantics. |
| Model-written program ↔ tool/API operations | Code Mode | Cross-cutting execution pattern; preserve nested-call authority, limits, evidence, and recovery semantics without assuming a shared runtime or protocol. |
| Editor/client ↔ coding agent | ACP | Preserve ACP Session, permission, and update semantics. |
| Independent agent system ↔ agent system | A2A | Preserve AgentCard, Task, Message, Artifact, and protocol lifecycle semantics. |
| Agent workload execution / orchestration runtime | Agent Executor (AX) | Emerging open-source runtime prior art; preserve AX Task/Workspace/Gateway/Model semantics without turning its v1alpha1 API into universal Harness Operations requirements. |
| Typed probabilistic decisions for automation | Jev / System One models | Emerging decision-model prior art; typed judgments can inform routing, policy, approval, and escalation, but surrounding systems retain governance and enforcement responsibility. |
| Telemetry representation | OpenTelemetry | Prefer OTel signals and GenAI conventions; do not create a competing generic telemetry protocol. |
| Telemetry/data-collection agent fleet management | OpAMP | Adjacent operational prior art; reuse lessons, not names by assumption. |
| Harness-specific lifecycle/capabilities | Native Harness interfaces | Preserve native semantics and adapt rather than flatten. |
| Cross-harness lifecycle, governance, routing, limits, human intervention, and evidence | No broadly adopted common model identified in v0.1 | Described by Harness Operations; protocol work remains deferred unless a concrete interoperability gap is demonstrated. |

## Areas of overlap that require care

### Tasks and Runs

MCP Tasks, A2A Tasks, and AX Tasks overlap with Harness Operations Run, but they do so at different boundaries.

**Do not create an extra Run merely because the reference model contains the word.** Use the native Task when its scope is sufficient. Introduce a broader Run only when execution genuinely spans multiple native tasks, sessions, Harnesses, Approvals, or environments.

An AX Task is a concrete runtime object rather than a normative cross-vendor protocol object. It should remain authoritative for AX lifecycle and execution semantics when AX is the runtime.

### Sessions

ACP and individual Harnesses may define concrete session semantics. Harness Operations Agent Session is an operational umbrella concept, not a replacement lifecycle.

### Artifacts

A2A defines Artifact normatively. Harness Operations uses Artifact descriptively. At an A2A boundary, the A2A Artifact remains authoritative.

### Capabilities

MCP discovery, A2A AgentCards, ACP initialization, native Harness APIs, and OpAMP expose different notions of capability. Harness Operations should not force them into one schema unless implementations demonstrate faithful equivalence.

### Permissions and Approvals

ACP, Harness-native permission systems, MCP authorization, environment policy, and Harness Operations Approval can interact but are not interchangeable.

A low-level permission request becomes an Approval only when it carries governance meaning: attributable Authority, a defined decision scope, and operational effect.

### Code execution and nested tool calls

Code Mode is a pattern that an implementation can provide, not a competing product row or evidence that two systems interoperate. Record the actual executor, tool-call bridge, configuration, and reviewed interface when comparing implementations.

An outer execution can complete while an inner operation fails or remains uncertain. Conversely, denying a later call does not undo earlier effects. Preserve these distinctions in execution state and evidence instead of flattening an entire program into one allow/deny or success/failure claim.

### Model decisions and enforcement

Jev and other structured decision systems can provide validated decision inputs, but a typed model answer is not itself an Approval, Authority grant, Policy rule, or enforcement boundary.

An implementation should record enough provenance to explain which decision input influenced an operational action, while keeping the model judgment distinct from the rule that interpreted it and the mechanism that enforced it. Where material, that provenance can include the decision model/version, question or schema, returned probabilities/confidence, the policy or threshold version that interpreted them, and the resulting action.

A confidence threshold is Policy or configuration, not governance by itself. Who may choose or change that threshold is a Governance question; the mechanism that applies it is an Enforcement question.

## Criteria for future interoperability work

A future Harness Operations interoperability proposal should demonstrate all of the following:

1. multiple independent Harnesses or operating systems need the same boundary;
2. existing standards and native interfaces cannot express the requirement faithfully enough;
3. the proposed semantics are implementation-neutral;
4. at least two independent implementations or prototypes can validate the model;
5. the proposal maps cleanly to MCP, ACP, A2A, OpenTelemetry, identity, and infrastructure standards;
6. the operational benefit exceeds the cost of introducing another interoperability surface.

Until those conditions exist, adapters and reference-model mappings are preferable to a new protocol.

## Standards and disciplines change over time

This landscape is time-sensitive.

MCP, ACP, A2A, Agent Executor, Jev/System One decision models, Code Mode implementations, OpenTelemetry GenAI conventions, AgentOps practice, and adjacent standards will continue to evolve. Harness Operations should become smaller when another standard or established discipline successfully absorbs a concern rather than defending conceptual territory for its own sake.

That is a feature of the project, not a failure.