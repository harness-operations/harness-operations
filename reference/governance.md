# Governance of Harness Operations Systems

## Purpose

Harness Operations is not only a coordination and observability problem. As agent harnesses gain the ability to access data, modify systems, spend resources, communicate externally, delegate work, and act without continuous human input, operating them becomes a problem of authority and accountability.

This document defines the operational governance concepts needed to reason about those systems.

It does not define legal compliance, organizational ethics programs, enterprise risk management, or a certification framework. Broader frameworks such as the NIST AI Risk Management Framework and ISO/IEC 42001 address organization-wide AI risk and management-system concerns. Harness Operations governance is narrower: it describes how authority, policy, approval, delegation, exceptions, limits, intervention, and accountability connect to actual harness execution.

Shared terms are defined in [Scope and Terminology](terminology.md) and the [Reference Model](model.md).

## Governance, policy, and enforcement

These concepts are related but distinct.

### Governance

**Governance** is the system of authority, ownership, delegation, approval, exception, change, and accountability around operational rules and decisions.

Governance answers questions such as:

- Who may define or change a Policy?
- Who owns the operational outcome?
- Who may start, stop, or redirect a Run?
- Who may delegate authority to an agent or automated service?
- Who may approve a risky transition?
- Who may authorize an Exception?
- What Limits apply, and who may change them?
- How are those decisions recorded and reviewed?

### Policy

A **Policy** is a rule or constraint intended to govern execution or access.

For example:

> Production changes require approval from an authorized release owner.

### Enforcement

**Enforcement** is the mechanism that causes or prevents behavior according to Policy.

Examples include:

- an operating-system sandbox;
- a network policy;
- a credential scope;
- a Harness permission gate;
- an approval checkpoint in a workflow engine;
- a prompt instruction or model-mediated guardrail.

These mechanisms provide different assurance. A prompt instruction stating that an agent should not access production is not equivalent to an environment in which production credentials and routes are technically unavailable.

Harness Operations systems should describe enforcement honestly. Implementations may expose assurance categories such as technically enforced, mediated/advisory, or unknown, but the Reference Model does not prescribe a fixed taxonomy.

## Principals and authority

A **Principal** is an identifiable human or machine actor to which authority or action can be attributed.

Governance requires enough identity to answer two separate questions:

1. **Who performed or requested the action?**
2. **Under whose Authority was the action permitted?**

Those answers may differ.

For example, a scheduled service Principal may start a Run under Authority delegated by a human Owner. An Agent Session may request a deployment using Authority granted by a Workflow and approved by another Principal.

The reference model does not require a particular identity provider or credential format.

## Authority

**Authority** is permission or decision-making power attributed to a Principal for a defined scope.

Authority should be scoped as narrowly as practical. Relevant dimensions can include:

- actions;
- resources;
- Harnesses or Harness Instances;
- Execution Environments;
- Workflows or Runs;
- time;
- Limits;
- the right to delegate further.

Authority is distinct from Capability.

A Principal may technically possess the Capability to perform an action while lacking governance Authority to use it. Conversely, a Principal may have Authority to approve an action without possessing the Capability to execute it.

## Ownership and responsibility

**Ownership** identifies operational responsibility for a resource, definition, environment, Policy, or outcome.

An Owner may be responsible for:

- maintaining a Workflow;
- defining acceptable Policy;
- selecting approvers;
- responding to failures;
- reviewing Exceptions;
- accepting an outcome;
- ensuring required evidence exists.

Ownership does not imply unlimited Authority. A system can deliberately separate ownership, approval, and execution rights.

## Delegation

**Delegation** is a bounded grant of Authority from one Principal to another Principal or operational actor.

Delegation is central to agent systems because autonomous execution frequently involves one actor allowing another actor to make decisions or take actions without asking again for every step.

A useful delegation records or makes recoverable:

- the delegating Principal;
- the receiving Principal or actor;
- the scope of Authority granted;
- applicable Limits and Policies;
- whether further delegation is permitted;
- the effective time and, where relevant, expiry;
- the originating decision or Approval.

Delegation should not imply universal context sharing. Authority, context, and Capability remain independently scoped concerns.

## Approval and authorization

An **Approval** is an attributable governance decision authorizing a proposed action, transition, Exception, or execution within a defined scope.

Approval should answer:

- what is being approved;
- who approved it;
- which Authority allowed that Principal to approve it;
- what scope the approval covers;
- whether it expires or is single-use;
- what evidence is retained.

### Approval is not blanket consent

A narrow approval should not silently become authority for unrelated future actions.

For example, approval to run one deployment should not automatically authorize all future deployments unless the governance model explicitly defines that broader scope.

### Native permission prompts

Harnesses may expose permission prompts for tool calls, commands, file access, network access, or other actions.

Not every native permission request is necessarily a Harness Operations Approval. A low-level permission mechanism maps to Approval when it represents a governance decision with attributable Authority and scope. Otherwise it may remain an execution-level control.

Standards and Boundaries should preserve those native semantics rather than assuming every permission mechanism means the same thing.

## Exceptions

An **Exception** is an explicit, scoped deviation from an otherwise applicable Policy or control.

Operationally useful Exceptions should be:

- attributable to an authorized Principal;
- limited to a defined scope;
- accompanied by a reason;
- visible in the Run or operational evidence where material;
- time-bounded or single-use where practical;
- reviewable after the fact.

### Break-glass access

Emergency or break-glass patterns are a form of Exception, not an absence of governance.

A break-glass path may intentionally reduce normal friction while increasing evidence, expiry, notification, or post-event review requirements.

## Limits and budgets

A **Limit** bounds measurable or countable operational behavior.

Examples include:

- money;
- tokens;
- compute;
- duration;
- concurrency;
- storage;
- tool calls;
- external messages;
- deployment count;
- delegated fan-out.

A **Budget** is a Limit applied to consumable resources or quotas.

Governance determines:

- who sets the Limit;
- who may change it;
- what happens when it is approached or exceeded;
- whether an Exception can override it;
- whether usage resets or accumulates;
- which evidence is required.

Limits are useful only when Usage can be measured with sufficient reliability for the intended decision.

## Change control

Operational definitions change over time. Workflows, Policies, routing rules, Limits, identity mappings, environment configuration, and approval requirements may all evolve.

Governance should preserve the distinction between current desired state and the state under which a historical Run executed.

Material changes should be attributable. Depending on risk, change control may include:

- versioning;
- review;
- Approval;
- staged rollout;
- rollback;
- effective dates;
- evidence of who changed what and why.

The Reference Model does not prescribe one version-control or deployment mechanism.

## Human intervention and escalation

Human involvement should be modeled as part of normal operations rather than an exceptional side channel.

Relevant interventions include:

- providing requested input;
- approving or denying an action;
- pausing or resuming a Run;
- canceling execution;
- changing routing or assignment;
- reducing or extending Limits;
- revoking delegated Authority;
- declaring an Exception;
- taking over manually after failure.

An operational system should make the required decision and its scope clear enough that a human is not forced to approve an ambiguous bundle of authority.

## Separation of duties

Harness Operations systems may separate the ability to create, review, approve, and execute consequential actions.

A neutral example:

```text
Builder
  may modify an Artifact
  may not approve its own release

Reviewer
  may approve the Artifact
  may not alter the protected Execution Environment

Executor
  may release approved Artifacts
  may not alter the reviewed source
```

The specific roles are illustrative. The principle is that Authority and Capability can be separated so one actor does not automatically control every stage of a consequential action.

Separation of duties is especially useful when an agent can both create a proposed change and invoke the tool that applies it.

## Accountability and audit evidence

**Accountability** is the ability to connect operational outcomes to the relevant Ownership, Authority, decisions, and execution evidence.

The Reference Model does not require Accountability to be represented as a separate stored object. It emerges from sufficiently reliable identity, governance decisions, resolved execution facts, and audit evidence.

An **Audit Record** may include or reference:

- the initiating Principal;
- the applicable Workflow and Policy versions;
- resolved Harness, model, and environment configuration;
- delegated Authority;
- Approvals and denials;
- Exceptions;
- relevant Events;
- Usage and Limit state;
- produced Artifacts;
- final outcome.

The required evidence depends on the operational and governance purpose. Harness Operations does not require universal collection of private conversation content simply to satisfy auditability.

## Context and governance

Context can contain source material, instructions, secrets, private reasoning inputs, tool results, or other sensitive information.

Governance should treat context access separately from Authority and Capability.

Examples:

- a reviewer may receive an Artifact and acceptance criteria without receiving the full private context of the builder;
- an execution agent may receive a deployment credential without receiving authority to change the underlying approval Policy;
- a research agent may receive network access without repository write Capability;
- an approver may receive enough evidence to make a decision without receiving execution credentials.

This separation reduces unnecessary privilege and limits accidental propagation of sensitive or untrusted context.

## Governance across multiple Harnesses

Different Harnesses may implement permissions, identities, session state, approval mechanisms, and security boundaries differently.

Harness Operations governance should not erase those differences.

A multi-harness operating layer may need to distinguish:

- a Policy that applies uniformly across all Harnesses;
- a Policy that can only be advisory for some Harnesses;
- a native Harness permission that has no direct equivalent elsewhere;
- an environment-level control that provides stronger enforcement than a Harness-level setting;
- Authority known to the operating layer from authority known only inside a native system.

Unknown or partially enforceable governance state should be represented as such rather than inferred as compliant.

## Example: delegated research

A human Owner authorizes an automated research Workflow.

```text
Owner
  │
  └── delegates limited Authority
          │
          ▼
      Research Run
          │
          ├── network Capability: allowed
          ├── repository write: unavailable
          ├── budget: bounded
          └── output: research Artifact
```

The Run can operate autonomously within its delegation. Exceeding the Budget or requesting additional Capability triggers escalation rather than silently expanding Authority.

## Example: reviewed deployment

A builder produces an Artifact. A separate reviewer approves it. A deployment actor applies only the approved Artifact.

```text
Builder Run
    │
    ▼
Artifact
    │
    ▼
Reviewer Approval
    │
    ▼
Deployment Run
```

The Builder's Capability to modify source does not imply Authority to approve deployment. The Executor's deployment Capability does not imply Authority to alter the reviewed Artifact.

## Example: emergency exception

A production incident requires temporary access normally forbidden by Policy.

```text
Incident
   │
   ▼
Exception request
   │
   ▼
Authorized Principal
   │
   ├── scope: one environment
   ├── expiry: bounded
   ├── reason: recorded
   └── extra audit evidence
```

The Exception changes the applicable governance state for a bounded purpose without pretending the underlying Policy never existed.

## Relationship to broader AI governance

Harness Operations governance is intentionally operational and execution-oriented.

Broader frameworks address organization-wide questions such as AI risk management, management systems, safety, fairness, privacy, legal obligations, organizational roles, and responsible-use processes. Harness Operations should integrate with those programs rather than attempt to replace them.

Background references include:

- NIST, [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- ISO, [ISO/IEC 42001 — AI management systems](https://www.iso.org/standard/42001)

These frameworks are not normative dependencies of Harness Operations The Reference Model.

## What this document does not define

This document does not define:

- an identity or authorization protocol;
- a policy language;
- compliance controls;
- an organizational hierarchy;
- a mandatory approval workflow;
- legal responsibility;
- a universal assurance-level taxonomy;
- a required audit-retention period;
- a certification scheme.

Those concerns may be implemented or governed externally while still mapping to the reference concepts defined here.
