# Pattern: Stop, revoke, and recover

**Status:** Applied Harness Operations v0.5

## Problem

“Stop the agent” is often treated as one operation even though several different operational states may exist.

A cancellation request may stop future model work while:

- a subprocess keeps running;
- a remote API request is already in flight;
- delegated work continues elsewhere;
- a side effect has already completed;
- the operator loses connectivity before learning the outcome.

A truthful operational system should not collapse these states into a single “stopped” label.

## Assumptions

This pattern assumes the operator can identify the native execution being controlled and has at least one observable control/evidence surface.

Not every Harness exposes all required controls. Unsupported and unknown states should remain explicit.

## Pattern

Separate five questions:

1. **Was cancellation requested?**
2. **Was cancellation observed by the target execution?**
3. **Are new protected actions prevented?**
4. **Has the execution environment/process actually terminated?**
5. **What side effects had already occurred?**

```text
operator requests stop
        │
        ▼
cancellation requested
        │
        ├── target unreachable ───────► outcome uncertain
        │
        ▼
target observes cancellation
        │
        ├── in-flight side effect ────► reconcile
        │
        ▼
new work prevented
        │
        ▼
execution quiesced / terminated
        │
        ▼
evidence reconciled
```

Revocation is related but distinct. Revoking Authority should prevent subsequent protected actions at the documented enforcement boundary. It may not terminate already-running work unless the implementation explicitly connects revocation to cancellation/termination.

## Native mechanisms

### Codex App Server 0.157.0

The reviewed SDK exposes `TurnHandle.interrupt()` for an active turn.

That is an execution-control primitive, not proof that external side effects were rolled back. A Harness Operations integration should separately track what the turn had already caused and whether downstream work remained active.

### Claude Code CLI 2.1.282

Claude Code exposes current-turn interruption behavior and session lifecycle controls. Native subagents add another concern: the parent/worker relationship must be understood before assuming interruption of one context terminates delegated work.

Claude Code permission rules or hooks can independently prevent subsequent protected tool calls even when existing work still needs reconciliation.

## Failure behavior

### Cancellation requested, no acknowledgment

Represent the outcome as unknown or pending, not canceled.

### Cancellation acknowledged

Record what the acknowledgment actually means. It may mean “signal accepted,” not “process terminated” or “side effects rolled back.”

### Network disconnect during execution

Preserve uncertainty. On reconnect, query/reconstruct native state rather than starting a duplicate action by default.

### Delegated work exists

Track the delegated execution independently. Parent cancellation should only be considered sufficient when the native Harness guarantees the relevant propagation behavior.

### Authority revoked mid-run

At the next enforcement point, deny new protected actions that require the revoked Authority.

If revocation is also intended to terminate active work, document the separate mechanism that performs that termination.

### Side effect completed before stop

Record completion. Do not rewrite history to “canceled.”

## Evidence

Useful evidence includes:

- cancellation request ID/time;
- native session/turn/task identity;
- target acknowledgment and semantics;
- last observed lifecycle state;
- delegated child identities;
- authority/policy version and revocation time;
- side-effect receipts or provider-native operation IDs;
- reconciliation result;
- explicit uncertain intervals.

## Example

The [approved-artifact handoff fixture](../examples/approved-artifact-handoff/README.md) simulates transport loss after the side effect.

It records an explicit uncertain outcome, then reconciles through an executor-side receipt before allowing a retry to resolve as already applied.

This demonstrates bounded duplicate prevention for the fixture's local file write only.

## Limitations

This pattern does not promise generic exactly-once execution.

External systems may offer no idempotency or reconciliation mechanism. In those cases the truthful answer can remain “outcome uncertain.”

Likewise, a Harness interrupt API should not be described as a kill switch unless the implementation proves the stronger process/environment termination property.
