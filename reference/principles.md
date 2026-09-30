# Harness Operations Principles

**Status:** Harness Operations Reference Model 0.5

These principles guide the design and evaluation of Harness Operations systems. They are descriptive architectural guidance, not protocol-conformance requirements.

## 1. Harnesses are independent systems

A Harness may define its own session model, capabilities, permissions, persistence, tools, execution semantics, and lifecycle. A Harness Operations layer should not require a Harness to surrender those native semantics in order to participate operationally.

**Implications**

- Treat each Harness as an independently meaningful system.
- Do not assume every Harness exposes the same controls or state transitions.
- Preserve access to native capabilities when a common abstraction is insufficient.

## 2. Compose before inventing

Harness Operations should reuse existing standards, protocols, infrastructure, and native Harness primitives where they already solve the problem.

New abstractions should be introduced only when a cross-harness operational gap is demonstrated.

**Implications**

- Map existing concepts before creating parallel ones.
- Prefer adapters or references to replacement semantics.
- Treat protocol design as an outcome of demonstrated interoperability need, not as a starting assumption.

## 3. Separate control from execution

Operational control and agent execution are distinct responsibilities.

A system may combine them in one process or product, but the reference model should not assume that the component observing and directing execution also owns the models, source data, credentials, or compute on which execution occurs.

**Implications**

- Support local, remote, hosted, and decentralized execution architectures.
- Minimize unnecessary transfer of execution data to control layers.
- Make trust boundaries between control and execution explicit.

## 4. Preserve native semantics

Normalization is useful only where meaning is genuinely shared.

Flattening different Harness states, capabilities, permission models, or session semantics into a common label can make a system easier to display while making it less truthful.

**Implications**

- Normalize common operational concepts conservatively.
- Retain native state and capability detail where common abstractions lose meaning.
- Distinguish “unsupported,” “unknown,” and “different” rather than treating them as the same condition.

## 5. Historical state must remain truthful

Mutable current configuration must not rewrite the facts of completed or in-progress execution.

A Run should remain explainable after models, policies, credentials, workflows, profiles, or infrastructure have changed.

**Implications**

- Capture resolved execution facts where later mutation would make history ambiguous.
- Preserve provenance for material configuration and authority decisions.
- Treat historical evidence as distinct from current desired state.

## 6. Governance, policy, and enforcement are different

A rule, the authority to create or change that rule, and the mechanism that enforces it are separate operational concerns.

Prompt instructions, organizational policy, approval requirements, and technical isolation controls should not be presented as equivalent forms of enforcement.

**Implications**

- Represent who has authority to make decisions separately from the rules themselves.
- Distinguish policy intent from observed enforcement capability.
- Avoid claiming a boundary is enforced when it is only advisory or model-mediated.

## 7. Authority, context, and capability should be independently scoped

Access to information, ability to act, and authority to make a decision are not the same thing.

A system should be able to share an Artifact without necessarily sharing the private context that produced it; grant a Capability without granting unrelated authority; or delegate authority without exposing additional context.

**Implications**

- Prefer explicit handoffs over universal context inheritance.
- Scope credentials, tools, filesystem access, network access, and decision authority independently where practical.
- Treat context propagation as an operational and security decision.

## 8. Humans are first-class operational actors

Human intervention is part of normal Harness Operations.

Approval, escalation, correction, suspension, cancellation, reassignment, and emergency intervention should be representable operational states rather than exceptional side channels.

**Implications**

- Make required human decisions visible and attributable.
- Preserve the scope of authority granted by an approval.
- Design interruption and recovery paths alongside autonomous execution paths.

## 9. Observability precedes autonomy

Increasing autonomous authority without increasing operational visibility produces systems that are harder to control precisely when control matters most.

Operators should be able to determine what is running, why it is running, what authority it has, what it is waiting on, and what it produced before autonomy is expanded.

**Implications**

- Treat lifecycle, attention, authority, and outcome visibility as prerequisites for higher autonomy.
- Prefer explicit unknown state to inferred certainty.
- Preserve enough evidence to diagnose unexpected autonomous behavior.

## 10. Interoperability should not require semantic erasure

Harness Operations should make heterogeneous Harnesses operable together without requiring them to become identical.

Portability and interoperability are valuable when they preserve meaningful differences rather than hiding them.

**Implications**

- Support multiple Harnesses, providers, and execution environments where practical.
- Prefer capability-aware routing over lowest-common-denominator interfaces.
- Allow implementations to expose native extensions alongside common concepts.

## Relationship to the reference model

The [Scope and Terminology](terminology.md) document defines the shared vocabulary used by these principles.

The Reference Model applies these principles to concepts and relationships. Governance expands the authority, policy, delegation, approval, exception, and accountability model. The Standards Landscape evaluates where existing standards already provide applicable semantics or interoperability boundaries.
