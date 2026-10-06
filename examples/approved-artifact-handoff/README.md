# Approved artifact handoff example

**Status:** deterministic fixture for Applied Harness Operations v0.3

This example demonstrates a narrow operational pattern:

producer → review of an exact artifact/action → attributable approval → pre-execution revalidation → protected side effect → durable evidence.

It is intentionally small. It is not an orchestration framework, approval protocol, identity system, policy language, or exactly-once execution mechanism.

## What the fixture demonstrates

The review and approval bind to content digests for both the artifact and proposed action. The executor validates them and rechecks the approval immediately before its protected side effect.

The fixture exercises:

- artifact mutation after review;
- action mutation after review;
- missing or malformed decision input;
- denied and expired approval;
- revocation between preflight validation and the protected side effect;
- transport loss after the side effect, producing an explicitly uncertain outcome;
- reconciliation through a durable executor-side receipt;
- retry of the same approved operation without replaying this fixture's file-write side effect;
- prevention of target path traversal outside the disposable workspace.

## Run

Requires Python 3.11 or newer and no third-party dependencies.

~~~bash
cd examples/approved-artifact-handoff
python -m unittest -v
python demo.py
~~~

The demo uses a temporary directory and no credentials, network calls, external models, AX, or Jev.

## Evidence boundary

The event log records IDs, content digests, decisions, and execution outcomes. It deliberately avoids recording raw credentials or private model context.

The example distinguishes:

- **Definition:** artifact/action proposal, review, approval, expiry, and authority state;
- **Execution:** validation, revalidation, protected side effect, retry, and reconciliation;
- **Evidence:** content digests, attributed decisions, receipts, and explicit uncertain/reconciled outcomes.

A declared approval is not proof that enforcement occurred. The fixture's enforcement boundary is the executor's immediate revalidation before its local file-write side effect.

## Important limitations

The durable receipt is stored on the same executor-side workspace as the fixture. It demonstrates one bounded duplicate-prevention technique, not generic exactly-once effects.

For a real external API, deployment, payment, message send, or other remote side effect, safe retry may require provider-supported idempotency keys or explicit reconciliation APIs. If neither exists, the outcome may remain uncertain.

Revocation is checked at the documented enforcement point. It cannot undo an already completed side effect, and the fixture does not claim instantaneous revocation propagation across distributed workers.

The reviewer decision is supplied as a deterministic Review object. A future live integration may use a Harness or decision service, but model output remains decision evidence—not Authority or enforcement by itself.

## Next integrations

This synthetic example is a stable baseline for the pattern itself. Codex and Claude Code reference entries and interface smoke tests are separate evidence, so passing this example can never be mistaken for real Harness compatibility.
