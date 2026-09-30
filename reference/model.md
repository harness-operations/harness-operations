# Harness Operations Reference Model

**Status:** Harness Operations Reference Model 0.5

## Purpose

This document defines the smallest useful conceptual model for operating agent harnesses across heterogeneous environments without prescribing a product architecture, storage schema, transport, orchestration engine, or control-plane topology.

The model is descriptive. Implementations may use different names, combine concepts, omit optional concepts, or expose additional native concepts so long as the resulting system remains operationally understandable.

Shared definitions are maintained in [Scope and Terminology](terminology.md).

## The three operational lenses

Harness Operations distinguishes **Definition**, **Execution**, and **Evidence**.

```text
DEFINITION           EXECUTION            EVIDENCE
what should happen   what is happening    what happened

Workflow             Run                  Artifact
Policy               Agent Session        Event
Authority             Harness Instance     Usage
Ownership             Execution Env.       Audit Record
Limits
```

These are conceptual lenses, not mandatory storage partitions. Some concerns—such as Approval, Capability, Delegation, and configuration provenance—cross more than one lens.

The distinction exists to preserve a critical operational property:

> Mutable current configuration must not rewrite historical execution truth.

A change to a model, policy, workflow, profile, credential, routing rule, or environment after a Run has started should not silently change the record of how that Run actually executed.

## Actors and operational roles

### Principal

A **Principal** is an identifiable human or machine actor to which authority or action can be attributed.

Examples include a human operator, a service identity, an automated scheduler, an agent acting under delegated authority, or an external system initiating work.

The reference model does not prescribe an identity protocol, credential format, or directory service.

### Operator

An **Operator** is a Principal acting to observe, direct, approve, intervene in, or otherwise operate the system.

An Operator may be human or automated. Human accountability may still be required by governance even where machine Principals perform routine operational actions.

### Control Plane

A **Control Plane** is a common but optional architectural role: a subsystem that observes and directs execution across Harnesses or environments.

The reference model does not require a centralized Control Plane. Valid architectures include:

- direct operation of individual Harnesses;
- peer-to-peer or federated coordination;
- local supervisors;
- centralized or distributed control planes;
- combinations of these models.

## Harness and execution concepts

### Harness

A **Harness** is software that turns a model into an operational agent by mediating an iterative or stateful task lifecycle and managing some combination of context, tools, execution, permissions, persistence, and interaction loops.

A Harness is a type of software system, not a particular running process.

### Harness Instance

A **Harness Instance** is a concrete, addressable deployment or installation of a Harness that is capable of executing Agent Sessions in an Execution Environment.

A Harness Instance may be idle or active. An implementation may represent a long-lived daemon, a CLI installation, a hosted agent endpoint, an ephemeral worker, or another executable deployment as a Harness Instance if it is operationally addressable.

The model does not require a one-to-one relationship between a Harness Instance and an operating-system process.

### Execution Environment

An **Execution Environment** is the compute and resource boundary in which a Harness Instance or Agent Session executes.

Examples include:

- a local operating system;
- a container;
- a virtual machine;
- an isolated sandbox;
- a managed cloud runtime;
- an ephemeral CI worker;
- an embedded application environment.

Execution Environment is operationally relevant because filesystem access, network access, credentials, tools, policy enforcement, and resource limits often depend on it.

### Agent Session

An **Agent Session** is an identifiable execution context managed by a Harness for carrying out agent activity.

A Session may include prompts, state, tool activity, context, plans, progress, or provider-specific metadata. It may outlive a particular provider process and may be resumable or transferable depending on the Harness.

The reference model intentionally does not require all Harnesses to share the same session lifecycle.

Protocols or Harnesses that define their own `Session` semantics retain those native meanings. Harness Operations uses Agent Session as a broader operational concept and should map rather than overwrite native session models.

### Run

A **Run** is one stable, identifiable execution of an operational objective, Workflow, or externally managed unit of activity.

A Run provides an operational identity above individual Agent Sessions when work needs to be observed, governed, or audited as one execution.

A Run may:

- exist before its first Agent Session begins;
- contain one Agent Session;
- contain multiple sequential or parallel Agent Sessions;
- span more than one Harness or Harness Instance;
- pause for Approval or human input;
- end successfully, fail, be canceled, or be interrupted;
- originate from a Workflow or be created directly.

A Run is not intended to replace native task/run/session objects from external standards or Harnesses. Implementations should map those objects where possible and introduce a distinct Run identity only when a broader operational lifecycle is genuinely needed.

## Definition concepts

### Workflow

A **Workflow** is a common but optional reusable definition of coordinated work, stages, roles, dependencies, or transitions.

Not every Run requires a Workflow. Some Runs may be created directly from an operator request, external event, schedule, or native Harness interaction.

A Workflow may reference Harness capabilities, roles, routing constraints, Approval points, Limits, Policies, or other definitions without requiring one orchestration engine.

### Policy

A **Policy** is a rule or constraint intended to govern execution or access.

Examples include:

- which Execution Environments may be used;
- which Capabilities are allowed;
- when human Approval is required;
- which models or providers may be selected;
- what network or filesystem access is permitted;
- what Limits apply.

Policy intent is separate from enforcement. Implementations should avoid presenting advisory instructions as equivalent to technical controls.

### Limit

A **Limit** is a bound on measurable or countable operational behavior or consumption.

Examples include maximum duration, concurrency, token use, cost, compute, storage, tool calls, or external actions.

A **Budget** is a type of Limit applied to consumable resources or quotas.

### Ownership

**Ownership** identifies operational responsibility for a resource, definition, environment, policy, or outcome.

Ownership does not necessarily imply exclusive Authority. Governance determines what Owners may decide and which responsibilities remain elsewhere.

## Governance and control concepts

### Authority

**Authority** is the permission or decision-making power attributed to a Principal for a defined scope.

Authority answers questions such as:

- Who may start this Run?
- Who may approve this deployment?
- Who may delegate access to this environment?
- Who may alter this Policy?

Authority should be distinguishable from technical Capability. A Principal may possess a Capability that governance does not authorize it to use in a particular context, or may have Authority to approve an action without having the Capability to execute it.

### Capability

A **Capability** is an operation, resource access, tool, external action, or other ability available to a Principal, Harness, Agent Session, or Run.

Capabilities may be:

- natively supported by a Harness;
- exposed by tools or external protocols;
- granted through credentials or environment configuration;
- conditional on Policy or Approval;
- unavailable or unknown to the operating layer.

Capability descriptions should not imply Authority unless governance explicitly grants it.

### Delegation

**Delegation** is a bounded grant of Authority from one Principal to another Principal or operational actor.

Delegation should be attributable and scoped. Relevant scope may include actions, resources, time, Limits, environments, or the right to delegate further.

### Approval

An **Approval** is an attributable governance decision authorizing a proposed action, transition, exception, or execution within a defined scope.

An Approval may be requested during a Run or required by Policy before execution begins.

Approval is not synonymous with every low-level Harness permission prompt. Native permission mechanisms may map to Approval when they represent a governance decision, or remain lower-level execution controls when they do not.

### Exception

An **Exception** is an explicit, scoped deviation from an otherwise applicable Policy or control.

An operationally useful Exception records who authorized it, what it applies to, why it exists, and—where practical—when it expires.

Detailed governance semantics are defined in the [Governance](governance.md) document.

## Evidence concepts

### Artifact

An **Artifact** is bounded output or a handoff produced during execution that can be referenced independently from the private conversational or context state that produced it.

Examples include a patch, report, plan, dataset, review result, generated document, structured result, or other deliverable.

A Harness Operations Artifact is a broad reference-model concept. Protocols such as A2A define their own normative Artifact semantics; implementations using those protocols should preserve the native meaning and map it rather than redefining it.

An Artifact may become input to another Agent Session or Run.

### Event

An **Event** is an observable fact or lifecycle transition associated with operational state.

Examples include:

- a Run starting;
- an Agent Session changing state;
- a permission or Approval being requested;
- a Harness Instance becoming unavailable;
- a Limit being reached;
- an Artifact being produced.

The reference model does not prescribe an event transport, persistence format, delivery guarantee, or event-sourcing architecture.

### Usage

**Usage** is measured consumption associated with execution.

Examples include tokens, money, compute time, wall-clock duration, storage, network use, or external-service consumption.

Usage can be evidence for enforcing or evaluating Limits without being identical to the Limit itself.

### Audit Record

An **Audit Record** is durable evidence sufficient to reconstruct or attribute relevant operational actions, decisions, configuration resolution, and outcomes for a defined purpose.

The model does not require Audit Record to be one stored object. It may be a projection over Events, Usage, Approvals, Artifacts, configuration snapshots, identity records, and native Harness logs.

The important property is that an operator can recover the relevant operational truth without relying solely on mutable current configuration.

## Core relationships

The following relationships are intentionally loose enough to support different Harness architectures.

```text
Principal
   │
   ├── owns / governs ─────► Workflow / Policy / Environment
   │
   ├── grants Authority / Delegation / Approval
   │
   └── operates ───────────► Run / Harness Instance

Workflow (optional)
   │
   └── defines or constrains ─────► Run

Run
   │
   ├── contains / coordinates ────► Agent Session(s)
   ├── executes under ────────────► Policy / Limits / Authority
   ├── uses ──────────────────────► Harness Instance(s)
   ├── produces / consumes ───────► Artifact(s)
   └── generates ─────────────────► Events / Usage / Audit evidence

Agent Session
   │
   ├── managed by ────────────────► Harness
   ├── executes through ──────────► Harness Instance
   └── receives capabilities from ► Harness / Environment / tools

Harness Instance
   │
   └── executes in ───────────────► Execution Environment
```

These relationships are conceptual, not required cardinalities.

In particular:

- a Run may begin before an Agent Session exists;
- a Run may include zero active sessions while paused;
- a Session may have native relationships that do not map one-to-one to a Run;
- an Artifact may be associated with multiple Runs;
- a Harness Instance may execute many Sessions;
- a Session may migrate or resume differently depending on native Harness semantics;
- governance may be centralized, delegated, or federated.

## Resolved execution facts

Harness Operations distinguishes desired configuration from **resolved execution facts**.

For example, a Workflow might request a generic model class or Harness profile. At Run time, routing may resolve that request to a particular Harness Instance, model version, Execution Environment, credential set, or Policy version.

If those choices are material to later explanation or audit, the Run's Evidence should preserve the resolved facts rather than depending only on the mutable Definition that produced them.

This is an operational principle, not a required serialization format.

## Architecture example A: local, direct operation

A developer operates two Harnesses on one workstation without a centralized Control Plane.

```text
Human Operator
     │
     ├──────────────┐
     ▼              ▼
Harness A        Harness B
Instance         Instance
     │              │
Session A        Session B
     │              │
     └──────┬───────┘
            ▼
      local artifacts
      logs and usage
```

Operational characteristics:

- the Operator directly controls each Harness;
- the Execution Environment is one workstation;
- each Harness retains its native session and permission model;
- a local tool may aggregate Events and Usage, but no central service is required;
- a Run identity is useful only if the operator wants to treat activity across the two Harnesses as one execution.

This architecture is valid Harness Operations even without a persistent Control Plane.

## Architecture example B: distributed managed operation

An organization operates multiple Harnesses across local and remote Execution Environments through a centralized operational service.

```text
                     Operators
                         │
                         ▼
                   Control Plane
                 /       │       \
                /        │        \
               ▼         ▼         ▼
         Environment A  Environment B  Hosted Agent
              │              │             │
         Harness A       Harness B      Harness C
              │              │             │
          Sessions        Sessions       Sessions
                \            │            /
                 \           │           /
                  └──── Runs / Workflows ┘
                           │
                 Artifacts / Events / Usage
                           │
                      Audit Evidence
```

Operational characteristics:

- Definitions may be centrally managed;
- execution remains distributed;
- Policies and Authority may vary by environment;
- different Harnesses expose different native capabilities;
- Runs provide lifecycle identity across Sessions;
- Approvals and Exceptions are attributable;
- resolved execution configuration is retained as Evidence;
- external standards may provide tool, agent, client, or telemetry interfaces without becoming the Harness Operations model itself.

The same reference concepts apply without requiring the architecture of example A to become centralized or example B to flatten Harness differences.

## What the model does not define

The Harness Operations Reference Model does not define:

- a wire protocol;
- a JSON schema;
- a mandatory Run state machine;
- a common Agent Session lifecycle;
- an identity protocol;
- a policy language;
- a telemetry transport;
- a workflow DSL;
- an Artifact serialization;
- a centralized control-plane requirement;
- conformance or certification criteria.

Those may become subjects of later proposals only when implementation experience demonstrates a cross-harness interoperability need that existing standards do not already satisfy.

## Related documents

- [Scope and Terminology](terminology.md)
- [Principles](principles.md)
- [Governance](governance.md)
- [Standards Landscape](landscape.md)
