# Pattern: Approval valid at execution time

**Status:** Applied Harness Operations v0.4

## Problem

An approval is only meaningful if the action actually executed still matches what was reviewed and authorized.

A common failure mode is:

```text
review proposal A
approve proposal A
proposal mutates to B
execute B using approval for A
```

The approval event may be perfectly attributable while the resulting action is still unauthorized.

## Assumptions

This pattern assumes:

- a proposed action or artifact can be identified stably enough to compare before execution;
- the approval has a bounded scope;
- the execution path contains a control point immediately before the protected side effect;
- the executor can fail closed when required evidence or authorization is unavailable.

The identifier may be a content digest, immutable artifact ID, versioned deployment object, provider-native revision, or another mechanism appropriate to the system.

The pattern does not require one universal identifier format.

## Pattern

Bind review and approval to the material execution facts they authorize.

At minimum, consider:

- artifact or proposed-action identity;
- protected operation;
- target resource/environment;
- approving Principal or decision source;
- relevant Policy version or conditions;
- expiry or other time bound where appropriate.

Then revalidate those facts at the enforcement point immediately before the protected action.

```text
proposal
   │
   ▼
review ─────► exact artifact/action identity
   │
   ▼
approval ───► exact artifact/action/target/scope
   │
   ▼
revalidate at enforcement boundary
   │
   ├── mismatch / expired / revoked ──► deny or re-approve
   │
   ▼
protected side effect
   │
   ▼
execution evidence
```

## Native mechanisms

Different Harnesses expose different pieces of this pattern.

### Codex App Server 0.157.0

The reviewed App Server surface exposes server-initiated approval requests for configured protected actions and pauses the turn for the client response.

That can supply a pre-execution control point, but the broader application still needs to decide what artifact/action identity an organizational approval binds to. The App Server approval flow should not be treated as proof that every relevant external artifact or target remained unchanged.

See [Codex mapping](../mappings/codex-app-server-0.157.0.md).

### Claude Code CLI 2.1.282

Claude Code permission rules and `PreToolUse` hooks can block matching tool execution before the side effect. This is a useful enforcement boundary for validating a proposal or approval token immediately before the protected tool call.

A prompt instruction such as “only deploy approved code” is not equivalent to a blocking permission rule or hook.

See [Claude Code mapping](../mappings/claude-code-cli-2.1.282.md).

## Failure behavior

### Artifact/action changed after review

Reject the old approval. Do not silently reinterpret it as approval for the new content.

The deterministic fixture demonstrates this with separate artifact and action digests.

### Approval unavailable or malformed

Fail closed for the protected action. Retry, denial, or escalation should be explicit.

### Approval expired

Do not execute. Request a new approval if Policy permits.

### Authority revoked

Re-check the revocation state at the documented enforcement point.

Revocation cannot retroactively undo a side effect that already completed before the revocation became effective.

### Policy changed

If the applicable Policy version is material to the decision, re-evaluate before execution rather than relying on a stale decision.

## Evidence

Useful evidence includes:

- proposed artifact/action identity;
- review identity/result;
- approval identity/result;
- approving Principal or decision source;
- applicable Policy/configuration version;
- revalidation result at the enforcement boundary;
- resolved execution target;
- final side-effect result or explicit uncertainty.

The important property is reconstruction: an operator should be able to explain why this exact action was allowed to run.

## Example

The [approved-artifact handoff fixture](../examples/approved-artifact-handoff/README.md) demonstrates:

- review bound to artifact/action digests;
- approval bound to the same digests;
- expiry and revocation checks;
- immediate pre-side-effect revalidation;
- rejection when the reviewed artifact or action changes.

Its local file write is intentionally simple. Real remote side effects may require provider-native identifiers, idempotency keys, or reconciliation APIs.

## Limitations

This pattern does not guarantee that a human understood the proposal, that a model-generated review was correct, or that the target system is trustworthy.

It also does not define a universal Approval schema. Native approval mechanisms should remain authoritative where they exist.

The core requirement is narrower:

> An approval for one material action must not silently authorize a materially different action.
