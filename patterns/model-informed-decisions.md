# Pattern: Model-informed decisions, code-enforced consequences

**Status:** Applied Harness Operations v0.5

## Problem

A model can produce a structured answer such as:

- allow / deny;
- select route A / B / C;
- risk score 0–100;
- confidence distribution.

That output can make automation easier to reason about, but it does not create Authority and it does not enforce the resulting action.

The dangerous shortcut is:

```text
model says “allow”
      │
      ▼
system treats answer as permission
      │
      ▼
high-impact action executes
```

The model judgment, Policy, Governance, and Enforcement are distinct operational layers.

## Pattern

Use a staged pipeline:

```text
state / evidence
      │
      ▼
model judgment
      │
      ▼
structural validation
      │
      ▼
policy evaluation
      │
      ▼
authorization / approval
      │
      ▼
technical enforcement
      │
      ▼
execution evidence
```

### Model judgment

The model answers a bounded operational question.

Examples:

- Which Harness should receive this task?
- Does this change require human review?
- What risk band does this proposed action fall into?

### Structural validation

Validate that the answer is well-formed and belongs to the expected decision space.

Typed/structured output reduces shape ambiguity. It does not establish correctness.

### Policy evaluation

Apply deterministic rules to the judgment.

For example:

```text
if risk_score >= 70:
    require human approval
else:
    continue under normal policy
```

The threshold is Policy/configuration.

### Governance

Determine who may define/change the threshold, override the result, or approve the action.

A model is not automatically the Principal with Authority to make that governance decision.

### Enforcement

Bind the resulting allow/deny/route decision to code that actually causes or prevents the protected action.

## Jev / structured decision systems

The Standards Landscape includes Jev as emerging typed decision-model prior art.

A Jev `Choice`, `Score`, or `Noul` can be useful input to routing, review, or escalation logic.

It does not itself force a downstream Harness to obey the answer.

A surrounding Harness, Control Plane, policy engine, hook, permission system, or application must bind the result to an operational consequence.

## Native enforcement examples

### Codex App Server 0.157.0

A model-informed decision can feed application Policy, but a configured App Server approval gate or sandbox boundary is a separate control.

The application should not treat the model's answer as equivalent to an App Server approval response.

### Claude Code CLI 2.1.282

A model or external decision service can inform a permission decision, while a blocking permission rule or `PreToolUse` hook provides the actual pre-execution control.

CLAUDE.md guidance alone remains advisory/model-mediated.

## Failure behavior

### Decision unavailable

Fail according to explicit Policy: deny, retry, fall back to a deterministic route, or escalate.

Do not silently reinterpret “no decision” as “allow.”

### Malformed decision

Reject it at structural validation.

### Low confidence / ambiguous probabilities

Policy decides whether to escalate, gather more evidence, select a conservative route, or deny.

### Model error or poisoned input

Structured output does not prevent bad judgment.

Use independent validation and technical controls for consequences that require stronger assurance.

### Decision becomes stale

If material input changed, recompute or invalidate the previous decision before execution.

### Policy threshold changed

Record the Policy version used to interpret the model result.

Changing a threshold later must not rewrite why a historical action was permitted.

## Evidence

When a model-informed decision materially affects execution, useful provenance can include:

- decision model/service and version;
- decision schema/question identifier;
- input/evidence references or safe digests;
- returned choice/score/probabilities;
- Policy/threshold version;
- approving/overriding Principal where applicable;
- enforcement mechanism/result;
- final execution outcome.

Avoid storing sensitive raw context merely for completeness.

## Example

The [approved-artifact handoff fixture](../examples/approved-artifact-handoff/README.md) treats the reviewer decision as input evidence and separately validates an Approval before execution.

The fixture deliberately rejects missing or malformed review input rather than using it as implicit permission.

## Limitations

This pattern does not claim that probabilities are calibrated, that a model is unbiased, or that structured decisions are deterministic in the semantic sense.

It also does not require Jev or any specific decision model.

The reusable operational rule is:

> Model output may inform a decision; code and authorized governance determine what the system actually does.
