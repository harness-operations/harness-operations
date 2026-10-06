# OpenAI Codex App Server


## Scope

- **System:** OpenAI Codex
- **Role:** Harness
- **Interface/surface:** Codex App Server
- **Version:** Codex CLI/App Server 0.157.0 (tag rust-v0.157.0)
- **Release date:** September 25, 2026
- **Deployment mode:** local App Server process / client-driven JSON-RPC-lite interface
- **Reviewed at:** September 25, 2026
- **Evidence status:** primary documentation and tagged public source documentation; live Harness Operations integration tests pending

This reference entry does not combine Codex Web, Agents API, IDE behavior, the interactive TUI, or other Codex surfaces into the App Server row.

## Primary sources

- https://github.com/openai/codex/releases/tag/rust-v0.157.0
- https://github.com/openai/codex/blob/rust-v0.157.0/codex-rs/app-server/README.md
- https://github.com/openai/codex/blob/rust-v0.157.0/sdk/python/docs/api-reference.md
- https://openai.com/index/unlocking-the-codex-harness/

## Native operational concepts

| Native concept | Native meaning | Harness Operations relationship | Notes |
| --- | --- | --- | --- |
| Thread | Durable Codex conversation/session container with persisted history | Agent Session; may participate in a broader Run | Preserve Codex thread identity and lifecycle. |
| Turn | One unit of agent work initiated by input | Execution within an Agent Session; not automatically a separate Run | Turn has status, timing, items, final response, and usage. |
| Item | Intermediate step/output within a turn | Event/Artifact/Capability activity depending on item type | Do not flatten unlike item types. |
| Approval request/response | Server-initiated gate for configured protected actions | May supply a pre-execution control and Approval input | Organizational Principal attribution is not assumed from the protocol alone. |
| Sandbox | Read-only, workspace-write, or full-access execution mode | Execution Environment / enforcement mechanism | Full access intentionally removes filesystem restrictions. |

## Lifecycle

OpenAI documents durable threads that can be started, resumed, forked, archived, and unarchived. Thread history is persisted so clients can reconnect. The App Server hosts multiple core thread sessions and emits thread/turn/item lifecycle events.

The Python SDK at the same tag exposes thread_resume and TurnHandle.interrupt. Interrupt is an execution-control primitive; it is not evidence that already completed external side effects were undone.

## Governance and enforcement

Depending on approval policy, App Server can send a server-initiated approval request and pause the turn until the client responds. This is a real pre-execution gate for the protected Codex action under that configured policy.

The public material reviewed does not establish that every approval response carries a durable named human Principal identity suitable for organization-wide accountability. Harness Operations therefore classifies attributed decision support as partial rather than inferring it.

Sandbox selection is a separate enforcement mechanism. Approval intent and sandbox enforcement must not be treated as the same control.

## Evidence

App Server exposes structured lifecycle notifications and persists thread history. The SDK exposes turn status, timing, items, final response, and token usage.

This is strong operational evidence, but not enough to claim a complete Audit Record for every resolved policy, credential, environment, and authority fact. The comparison dataset therefore marks resolved execution facts as partial.

## Capability summary

The canonical capability observations live in [System Comparisons](../comparisons/data/systems.json).

Documentation-backed available findings:

- machine control surface;
- stable session identity;
- resume/reconnect;
- turn interruption;
- parallel active turns;
- configured pre-execution approval gate;
- configured sandbox isolation;
- token usage reporting;
- operational event/history export.

Partial:

- attributable decision;
- resolved execution facts.

Unknown based on current evidence:

- stable delegation/handoff contract for the scoped App Server interface;
- credential mediation under the stronger matrix definition;
- generic enforced resource limits.

Interactive operation is not applicable to the App Server row because interactive Codex UIs are separate surfaces.

## Further validation

Useful live tests include:

1. start thread → start turn → collect structured events;
2. resume by thread ID and verify continuity;
3. interrupt an active turn and record final state;
4. trigger a configured approval request, deny it, and verify the protected action does not execute;
5. run a workspace-write sandbox test against a disposable target;
6. compare documented and observed usage/evidence fields.

A later runtime version should receive new scoped observations rather than silently inheriting these results.

## Limitations

This reference entry is descriptive, not certification or endorsement. Documentation-backed findings can be corrected by live test results, and a passing live test establishes only the exact operation/configuration tested.
