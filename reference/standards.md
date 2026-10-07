# Standards and Interoperability Boundaries

**Evidence dates:** External-source review below dates to September 25, 2026;
Code Mode examples were reviewed September 30, 2026. This editorial reorganization
does not refresh product or protocol claims. Check the linked sources for subsequent changes.

## Purpose

Different interfaces solve different problems. This guide explains where tools,
clients, agent-to-agent communication, code execution, and telemetry fit, without
asking every system to adopt the same architecture.

Use the native terms of the system you are investigating. A shared protocol name
is a starting point for questions, not proof that two products work together.

### Implementation prior-art inclusion rule

Implementation examples belong here when they clarify a useful capability or
boundary. Inclusion is not an endorsement, a compatibility result, or a requirement
to use that implementation.

## Guiding rule: compose before inventing

Start by investigating existing native interfaces and standards. Adaptation may be
useful where boundaries differ, but a common abstraction should not erase differences
in permissions, state, execution placement, or failure behavior. Harness Operations
publishes no required wire protocol or shared execution model.

## Boundary map

| What you are investigating | Where to start |
| --- | --- |
| An AI application and its tools or context | MCP and native tool interfaces |
| An editor or client and a coding agent | ACP or the agent's own API |
| Independent agent systems | A2A and documented integration boundaries |
| A generated program and its nested tool calls | Code Mode / programmatic tool calling |
| Execution placement, resources, and recovery | The actual runtime and its configuration |
| Traces, events, metrics, and logs | OpenTelemetry and native telemetry |

These are questions to explore, not layers every system needs.

## AgentOps and broader agent operations

The reviewed sources use AgentOps and agent operations with different emphases,
including observability, evaluation, deployment, cost, and operational controls.
Do not assume a common product category or standard from the name alone.

- [AWS: operationalize agentic AI at scale](https://aws.amazon.com/blogs/machine-learning/agentops-operationalize-agentic-ai-at-scale-with-amazon-bedrock-agentcore/)
- [AgentOps documentation](https://docs.agentops.ai/v2/introduction)
- [AgentOps observability research](https://arxiv.org/abs/2411.05285)

### Relationship to Harness Operations

These sources are useful background for comparing how agent work is observed and
operated. The project does not define an architecture above them or claim ownership
of the broader discipline.

## Model Context Protocol (MCP)

### Current scope

MCP connects AI applications to external systems exposing tools, resources, prompts,
and related capabilities. The earlier source review covered the 2026-07-28 revision
and its draft Tasks extension; that is the scope of this snapshot, not a claim about
the latest revision.

- [Reviewed specification release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [MCP specification at the reviewed revision](https://modelcontextprotocol.io/specification/2026-07-28)

### Relationship to Harness Operations

Investigate what a particular client and server expose, how authorization is handled,
and which extensions are implemented. A task, connector, or tool listing does not
by itself prove recovery, approval, or compatibility with another system.

## Code Mode

**Section verification:** September 30, 2026. These examples retain their reviewed
sources and scope; this is not a fresh availability check.

### Scope

**Code Mode** is a tool-use pattern in which a model writes executable code that
calls tools or APIs, composes operations, and processes intermediate results before
returning selected output to the model. Loops, conditions, batching, and result
filtering can run in code without another model inference for every underlying operation.

The name describes a pattern, not a required product or a new interoperability
protocol. A general-purpose code interpreter, tool-search feature, or shell command
alone does not establish code-mediated orchestration of tools.

### Origins and adoption

Cloudflare introduced its named Code Mode framing and Agents SDK implementation
on September 26, 2025. Earlier work, including CodeAct, explored executable code as
agent actions; the pattern is not evidence that any one project invented that broader idea.

- [Cloudflare: Code Mode](https://blog.cloudflare.com/code-mode/)
- [CodeAct, ICML 2024](https://proceedings.mlr.press/v235/wang24h.html)

These documentation- and source-backed examples concern different execution
surfaces, not every product offered by each vendor.

| Implementation example | Documented execution surface | Scope to preserve |
| --- | --- | --- |
| [Cloudflare Code Mode](https://developers.cloudflare.com/agents/tools/codemode/) | Generated code orchestrates configured tools in an execution environment; [MCP server variants](https://developers.cloudflare.com/agents/model-context-protocol/codemode/) expose code execution to clients. | Distinguish client-side integration from execution owned by the MCP server. |
| [Goose Code Mode](https://goose-docs.ai/docs/guides/managing-tools/code-mode/) | An enabled built-in extension supports on-demand discovery and programmatic calls to tools from other extensions. | A documented harness extension; availability and configuration belong to the reviewed build. |
| [Codex code-mode tool adaptation](https://github.com/openai/codex/blob/67727e7cf114cf3e1b71db368d74b24e32f6cb12/codex-rs/tools/src/code_mode.rs) | Inspected revision `67727e7` adapts function, freeform, and namespaced tool definitions for the code-mode runtime. | Source-backed integration, not a live compatibility test. The [configuration reference](https://developers.openai.com/codex/config-reference/) described `features.code_mode.enabled` as under development and off by default at review; do not infer availability across Codex surfaces. |
| [Pi MCP and Code Mode](https://pi.dev/docs/latest/mcp) | The built-in integration, introduced in [Pi 0.99.0 on September 29, 2026](https://pi.dev/changelog), runs model-written JavaScript in QuickJS and makes MCP tools callable from scripts. | Review the built-in integration and configuration; replacement extensions or SDK embeddings can differ. |
| [Anthropic programmatic tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) | Model-written Python invokes configured tools through a code-execution container and processes intermediate results. | A Claude API feature, not a blanket claim about Claude Code CLI, SDK, or hosted surfaces. |
| [OpenAI API programmatic tool calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) | Hosted JavaScript orchestrates eligible tools in an isolated V8 runtime. | A model-platform API surface, separate from Codex. In the reviewed Responses API, `allowed_callers` controls invocation paths; the application still executes client-owned function calls. |
| [FastMCP CodeMode](https://gofastmcp.com/servers/transforms/code-mode) | A server transform exposes discovery and sandboxed Python execution over existing tools. | Server-side tooling; a connecting MCP client need not implement the code runtime itself. |

These are not Harness Operations live compatibility tests. Shared naming does not
imply the same language, discovery API, isolation, approvals, persistence, replay,
or cancellation behavior. There is no single Code Mode protocol version to adopt.

### Relationship to MCP and native interfaces

Code Mode changes how operations are composed, not necessarily their transport or
authorization. It can use MCP tools, native APIs, or application-provided functions.
It neither requires nor replaces MCP.

A client can consume a Code Mode service through an ordinary tool interface.
**Using a Code Mode MCP server is not evidence that the client has native Code Mode support.**
Discovery is distinct from running a program that orchestrates calls.

Pi's [reviewed MCP configuration](https://pi.dev/docs/latest/mcp#control-tool-exposure)
defaults to `codemode` exposure and activates code mode for a connecting server
with that exposure unless `autoEnableCodemode` is disabled. Tools registered as
`mcp__<server>__<tool>` become script-callable through the integration. The server
still speaks MCP; automatic exposure does not grant downstream permissions.

Fewer model round trips can be useful, but workload-specific measurement matters.
[Goose's implementation account](https://goose-docs.ai/blog/2025/12/21/code-mode-doesnt-replace-mcp/)
also describes discovery and code-generation overhead for simpler tasks.

### Relationship to Harness Operations

One outer code-execution request may contain many consequential actions. To compare
implementations, ask what you can observe and control inside that request:

- **Execution and exposure:** Which runtime executes the program? Which tools are directly callable, discoverable, or excluded? Can inner calls be correlated with the outer request?
- **Permissions and limits:** Which component enforces authorization, approvals, revocation, resource limits, credential access, and egress? Starting a program does not authorize every action inside it.
- **Evidence and recovery:** Are inner outcomes recorded, truncated, or redacted? Can a program finish despite a failed call? Which actions completed before cancellation, and could retrying duplicate them?

These are investigation questions, not a required architecture. Different tools
may already address them through different mechanisms.

[Codex configuration](https://developers.openai.com/codex/config-reference/) distinguishes
direct-only and excluded namespaces; the [OpenAI API](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
distinguishes direct and programmatic callers; [Pi extensions](https://pi.dev/docs/latest/extensions#tool-exposure)
can mark a tool `model-only`. These illustrate different invocation restrictions,
not equivalent policy systems.

[Cloudflare's durable runtime](https://developers.cloudflare.com/agents/tools/codemode/durable-runtime/)
documents execution history, approval pauses, replay-based continuation, and
connector-dependent compensation. [FastMCP](https://gofastmcp.com/servers/transforms/code-mode#tool-call-limits)
documents a separate bound on inner calls. Those guarantees belong to the implementation,
not to Code Mode in general.

Pi's [permissions documentation](https://pi.dev/docs/latest/mcp#permissions) describes
a shared extension tool pipeline and `parentToolCallId` correlation. Its
[extension contract](https://pi.dev/docs/latest/extensions#tools) allows `isError`
results with structured data and bounded `nestedCalls` records without result
payloads; `complete: false` marks omitted information. Outer success, inner outcome,
and evidence completeness remain separate questions.

[Pi's introduction](https://earendil.com/posts/you-said-no-mcp/) combines MCP access
and Jev classification. Treat classifier results as
[model-informed decision inputs](../patterns/model-informed-decisions.md), not
permissions. Code control flow does not make model judgments correct or deterministic.

Code Mode does not eliminate prompt injection, data-exfiltration risk, or the need
to understand who actually executes and authorizes an operation.

## Agent Client Protocol (ACP)

### Current scope

ACP covers communication between coding agents and editors or interactive clients,
including sessions, prompts/updates, tool-call presentation, and permission requests.
The earlier review recorded stable v1 with v2 draft work; use the sources to check
subsequent changes rather than treating that snapshot as current availability.

- [ACP repository](https://github.com/agentclientprotocol/agent-client-protocol)
- [ACP changelog](https://github.com/agentclientprotocol/agent-client-protocol/blob/main/CHANGELOG.md)

### Relationship to Harness Operations

Compare the actual session and permission behavior exposed by the implementation.
A client using ACP does not necessarily supply the same tools, persistence, or
execution environment as another client using ACP.

## Agent2Agent Protocol (A2A)

### Current scope

A2A describes communication between independent agent systems, including AgentCard,
Message, Task, Artifact, streaming, notifications, and extensions. The earlier
source review covered the 1.0 protocol family and 1.0.1 specification fixes.

- [A2A specification](https://github.com/a2aproject/A2A/blob/main/docs/specification.md)
- [A2A changelog](https://github.com/a2aproject/A2A/blob/main/CHANGELOG.md)

### Relationship to Harness Operations

A protocol can define an interaction without proving a particular pair of products
successfully completes it. Look for exact endpoints, versions, operation, configuration,
expected outcome, and observed result. Use native task and artifact meanings instead
of adding another shared object model.

## Agent Executor (AX)

### Current scope

The reviewed AX runtime describes Task, Workspace, Gateway, and Model resources for
execution, dependencies, network/credential controls, and model configuration.
It is an implementation to investigate, not a cross-vendor standard or a complete
application for every workload.

- [Agent Executor](https://agentexecutor.io/)
- [google/ax](https://github.com/google/ax)
- [Introduction](https://cloud.google.com/blog/products/ai-machine-learning/agent-executor-googles-distributed-agent-runtime)

### Maturity

The review concerned the evolving `ax.io/v1alpha1` API. Verify the version and
configuration used by a specific deployment; do not transfer these observations
to another release or runtime.

### Relationship to Harness Operations

Investigate execution placement, suspend/resume, resources, network policy, credentials,
and observable failure behavior. Intended configuration and effective enforcement
are different evidence. No mapping to a project-wide architecture is required.

## Jev and System One decision models

### Current scope

The reviewed TypeSafe API described `Noul`, `Choice`, and `Score` for typed,
probabilistic model judgments. These are decision inputs, not execution mechanisms.

- [TypeSafe AI](https://typesafe.ai/)
- [Introduction](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [API documentation](https://api.typesafe.ai/docs)

### Maturity

The source review covered early-access Jev and API 0.2.0. This guide does not
establish current availability, calibration, or suitability for a particular decision.

### Relationship to Harness Operations

A structured answer can be easier for code to consume without being correct or
well-calibrated. Ask which rule interprets it and which component carries out or
prevents the resulting action. A downstream agent does not become bound to a
decision merely because it was formatted as structured data.

## OpenTelemetry

### Current scope

OpenTelemetry supplies APIs, SDKs, protocols, and conventions for telemetry. The
reviewed GenAI conventions were in development and covered model, agent, workflow,
tool, memory, metric, and event observations.

- [Semantic conventions](https://opentelemetry.io/docs/specs/semconv/)
- [GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai)

### Relationship to Harness Operations

Investigate which signals an integration exports and what they actually establish.
A trace is not necessarily the full lifetime of a task, nor proof of correctness,
complete retention, or an independently verified external effect.

## Open Agent Management Protocol (OpAMP)

OpAMP concerns telemetry/data-collection agents such as collectors and log forwarders,
not AI-agent interoperability. The earlier review described beta-stage mechanisms
for fleet health, identity, capabilities, configuration, and package/update state.

- [OpAMP specification](https://opentelemetry.io/docs/specs/opamp/)

Those mechanisms are useful operational background, but the shared word “agent”
is not a reason to treat telemetry collectors and AI-agent systems as equivalent.

## Native Harness APIs and protocols

A native CLI, API, event stream, plugin, or SDK may expose useful behavior not
represented by a common protocol. Review the exact interface rather than infer
support from the broader product family. A local client does not imply local model
inference, offline execution, or local-only data handling.

## Boundary summary

MCP tool exposure, ACP client sessions, A2A interactions, runtime execution, and
telemetry can coexist without becoming one architecture. A reviewed tool can be
useful with only a subset—or none—of them.

## Areas of overlap that require care

### Tasks and Runs

Check the system's own definition; there is no additional Harness Operations task
or run object to implement. A background response is not automatically a durable workflow.

### Sessions

Check what persists, what a resumed interaction inherits, and whether permissions
or environment changes are reflected. A session ID alone does not answer these questions.

### Artifacts

A produced file, a protocol artifact, and a summary may represent different facts.
Ask what was actually created and where its contents or provenance can be checked.

### Capabilities

Discovery metadata is not execution evidence. An advertised tool may still need
configuration, credentials, permissions, or a compatible client.

### Permissions and Approvals

Protocol authorization, native permission requests, human approvals, and environment
policy may constrain different actions. Identify the actual enforcement boundary.

### Code execution and nested tool calls

An outer execution may complete while an inner operation fails or remains uncertain.
Denying a later call does not undo an earlier effect. Keep these cases distinct when
comparing recovery, retries, logs, and approval behavior.

### Model decisions and enforcement

Typed model output is not itself a permission grant or a correctness guarantee.
Distinguish the model judgment, the rule interpreting it, and the mechanism applying it.

## Criteria for future interoperability work

Explain a concrete need and why existing interfaces are insufficient, preserve
native scope, and provide reproducible evidence of the operation claimed. There is
no project protocol or architectural conformity requirement to satisfy first.

## Standards and disciplines change over time

This is a dated evidence guide. Prefer the primary sources for new revisions and
record the scope/date of fresh reviews rather than silently treating old observations
as current. The earlier architecture-oriented text remains available in
[the immutable historical version](https://github.com/harness-operations/harness-operations/blob/ce9e7d2c01d154e1bef575799ee7b6a15fdf26fe/reference/standards.md)
for provenance and historical subsection links.
