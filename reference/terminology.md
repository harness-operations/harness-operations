# Scope and Terminology

**Status:** Harness Operations Reference Model 0.4

This document establishes the working scope, boundaries, and shared vocabulary used by the Harness Operations Reference Model. It is intentionally descriptive rather than a protocol or conformance specification.

## Definition

**Harness Operations** is the practice of operating one or more agent harnesses as a coherent system across their lifecycles, environments, work, and authorities. It covers observation, coordination, security, governance, resource and usage controls, human intervention, and auditability while preserving each harness's native semantics.

Harness Operations is an operational discipline and reference model. It does not require a central control plane, a particular deployment architecture, or a new wire protocol.

Harness Operations is deliberately **harness-centric**. It uses the Harness as an operational unit because the Harness is where agent-session lifecycle, context, tools, permissions, execution, persistence, and other native semantics are concretely mediated.

## Boundary with adjacent disciplines

### Harness engineering

Harness engineering builds and improves the machinery that makes an individual agent effective.

Harness Operations concerns the ongoing operation of harnesses and their executions as a system.

### AgentOps and agent operations

`AgentOps` and `agent operations` are emerging umbrella terms for practices and products concerned with deploying, observing, evaluating, securing, governing, and managing AI agents in production. Usage is not uniform: some definitions center observability and testing, while others include lifecycle, governance, cost, security, and fleet management.

The v0.1 prior-art review did **not** identify a broadly adopted common AgentOps specification or reference model. Harness Operations therefore does not treat AgentOps as a parent specification or standardized taxonomy.

Harness Operations is **adjacent to and overlapping with** broader AgentOps / agent-operations practice, but it addresses a more specific systems problem: operating one or more Harnesses—with potentially different session, capability, permission, context, execution, governance, and persistence semantics—coherently without flattening those differences.

### Agent frameworks and orchestration

Agent frameworks provide primitives for constructing agents and workflows. Orchestration coordinates execution among agents, tasks, or tools.

Both may participate in Harness Operations, but orchestration is only one operational concern among lifecycle management, observation, security, governance, approvals, resource controls, intervention, and evidence.

### Model serving

Model serving operates inference infrastructure and model endpoints. Harness Operations begins above that layer, where models are mediated by agent harnesses with execution state, context, capabilities, and authority.

### DevOps, SRE, platform engineering, and workflow engineering

Harness Operations should reuse established operational practices rather than rename them. Its narrower concern is where agent harnesses introduce operational problems around agent lifecycle, context, delegated authority, capabilities, approvals, autonomous execution, and evidence across heterogeneous harnesses.

## Organizing lens

Reference Model 0.1 distinguishes three kinds of operational state.

### Definition

What should happen: intended configuration, workflow, authority, and policy.

### Execution

What is happening or happened as an identifiable execution: runs, agent sessions, harness instances, and execution environments.

### Evidence

What can demonstrate what occurred: artifacts, events, usage, decisions, and audit information.

These layers may reference one another, but they should not be collapsed. Mutable current configuration must not rewrite historical execution truth.

## Governance and policy

**Policy** describes rules and constraints that apply to execution.

**Governance** describes the authority, ownership, delegation, approval, exception, change, and accountability system around those rules.

Policy enforcement is a separate concern again. A stated rule, prompt instruction, or organizational expectation is not equivalent to a technical control that enforces it.

## Core concepts

### Principal

An identifiable human or machine actor to which authority or action can be attributed.

### Operator

A Principal acting to observe, direct, approve, intervene in, or otherwise operate an agent system.

### Harness

Software that turns a model into an operational agent by mediating an iterative or stateful task lifecycle and managing some combination of context, tools, execution, permissions, persistence, and interaction loops.

A stateless model client that only sends a request and returns a response is not, by itself, a Harness. A framework or SDK may be used to build a Harness without itself being an operational Harness deployment.

### Harness Instance

A concrete, addressable deployment or installation of a Harness that is capable of executing Agent Sessions in an Execution Environment. A Harness Instance may be idle or active.

A package or binary that is merely present but not configured or addressable for execution does not need to count as a Harness Instance.

### Execution Environment

The compute, operating-system, sandbox, container, virtual-machine, hosted runtime, or other environment in which a Harness Instance or Agent Session executes and receives access to resources.

### Agent Session

An identifiable execution context managed by a Harness for carrying out agent activity. A session may outlive a single provider process and does not imply a particular transport, process model, chat interface, or persistence mechanism.

### Run

One stable, identifiable execution of an operational objective, Workflow, or externally managed unit of activity. A Run may contain one or more Agent Sessions and may span more than one Harness Instance.

### Artifact

Bounded output or a handoff produced during execution that can be referenced independently from the private conversational or context state that produced it.

Durable storage is not required by the abstract model. Implementations that depend on an Artifact for handoff, review, or audit should give it stable identity and provenance.

### Capability

An operation, resource access, tool, external action, or other ability available to a Principal, Harness, Agent Session, or Run.

### Authority

The permission or decision-making power attributed to a Principal for a defined scope.

### Ownership

Operational responsibility for a resource, definition, environment, policy, or outcome.

### Policy

A rule or constraint intended to govern execution or access.

### Delegation

A bounded grant of Authority from one Principal to another Principal or operational actor.

### Approval

An attributable governance decision authorizing a proposed action, transition, exception, or execution within a defined scope.

### Exception

An explicit, scoped deviation from an otherwise applicable Policy or control, with attributable authority and preferably a bounded lifetime.

### Limit

A bound on measurable or countable operational behavior or consumption.

A **Budget** is a type of Limit applied to consumption such as money, tokens, compute, duration, concurrency, or external actions.

### Event

An observable fact or lifecycle transition associated with operational state.

### Usage

Measured consumption associated with execution, such as tokens, money, compute, storage, duration, or external-service use.

### Audit Record

Durable evidence sufficient to reconstruct or attribute relevant operational actions, decisions, configuration resolution, and outcomes for a defined purpose.

## Common but optional architectural concepts

### Control Plane

A role or subsystem that observes and directs execution across Harnesses or environments.

A Control Plane is common but not mandatory. Decentralized Harness Operations architectures remain valid.

### Workflow

A reusable or durable definition of coordinated work, stages, roles, dependencies, or transitions.

A Workflow is useful but not universal. A Run does not need to originate from a Workflow.

## Deferred as a first-class v0.1 concept

### Work

"Work" remains useful explanatory language for objectives and activity but is intentionally not defined as a required first-class reference-model object in v0.1. The model should introduce a stronger concept only if the later reference work demonstrates a cross-harness operational need for it.

## Normative language

Reference Model 0.1 does not use RFC 2119 or RFC 8174 `MUST`, `SHOULD`, or similar keywords as conformance requirements.

The reference model may state design invariants or recommendations in ordinary language, but v0.1 does not define protocol conformance, certification, or mandatory implementation behavior.

## Scope rule

A concept belongs in the Harness Operations reference model only when it describes a cross-harness operational concern. Concepts that exist only because one product, vendor, deployment, or architecture needs them remain implementation details or examples until broader evidence justifies inclusion.
