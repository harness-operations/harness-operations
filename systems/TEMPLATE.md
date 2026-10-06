# System Reference Template

Use this template for an evidence-backed reference entry for a concrete Harness or adjacent System subject.

A reference entry describes the subject in its native terms first. It is not automatically a Harness Operations requirements assessment, endorsement, conformance statement, benchmark result, or live interoperability test.

## Operational relevance

- **Subject:**
- **Subject kinds:** one or more of Harness / model / client / application / framework / agent definition / skill package / tool interface / tool service / execution runtime / control layer / decision service / domain-specific specification / other
- **Workload/domain (when applicable):**
- **Operational characteristics (when applicable):**
- **Intended user/operator:**
- **Distinct operational question this entry helps explain:**

Do not label a subject a Harness merely to make it fit the project.

## Reviewed scope

- **Interface/surface:**
- **Version / release / commit / hosted observation date:**
- **Deployment mode:**
- **Platform/environment:**
- **Plan/edition/features:**
- **Material configuration:**
- **Reviewed at:**

Separate materially different CLI, IDE, SDK/server, hosted, plugin, or configuration surfaces when their semantics differ.

## Primary sources

List authoritative documentation, source, release notes, protocol specifications, and reproducible test evidence used.

Separate current first-party evidence from historical background or community/operator reports.

## Native architecture and concepts

Describe the system using its own vocabulary before applying Harness Operations terms.

At minimum, identify where applicable:

- the agent loop and the component that owns it;
- native units of work, session/state, roles, artifacts, findings, or jobs;
- models and model-selection behavior;
- tools, APIs, resources, or services exposed to the agent;
- deterministic infrastructure surrounding the agent;
- user/operator interaction surfaces.

A multi-model workflow is not necessarily a multi-agent system.

## Workload and completion

Describe:

- the work the system is designed to perform;
- inputs and outputs;
- what counts as successful completion;
- quality, verification, or evidence gates;
- conditions that may intentionally stop or defer the work.

Do not reuse one domain's completion criteria as a universal agent lifecycle.

## Execution, data, and credential boundaries

Identify where relevant:

- execution environment and isolation;
- filesystem and network reachability;
- credentials and secrets;
- model/inference endpoint;
- data that leaves the local environment;
- external side effects;
- component responsible for each material enforcement boundary.

A local CLI does not by itself imply local inference or local-only data handling.

## State, lifecycle, and intervention

Describe documented and observed behavior for applicable lifecycle events such as:

- create/start;
- persistence and resume;
- pause or waiting for input;
- cancellation/interruption;
- timeout or disconnect;
- restart/recovery;
- policy or authority change.

Do not infer one behavior from another.

## Independent and cooperative operation

### Independent use

Explain how the subject can operate by itself within the reviewed scope.

### Relationships

Record material source-backed relationships separately. Add a machine-readable relationship only when both endpoints are established at the scope represented by their Systems subjects; otherwise keep the broader product-family relationship in prose. Examples include:

- hosted by;
- invokes;
- supplies tools to;
- configured by;
- consumes or produces an artifact for;
- specified or described by.

A relationship is not automatically an interoperability claim.

### Tested interoperability

For a demonstrated or failed cross-system operation, record the exact source and target interfaces, versions/configuration, operation, boundary/transport, expected result, observed result, and limitations.

Shared protocols, skill formats, install instructions, or product-family branding are insufficient evidence by themselves.

## Failure and recovery behavior

Record material failure modes and what happens after:

- partial completion;
- tool or provider failure;
- lost responses;
- retries;
- duplicate effects;
- stale state;
- worker/process loss;
- unresolved external outcomes.

If the outcome can remain uncertain, say so rather than inventing rollback or exactly-once guarantees.

## Evidence and auditability

Identify what can be retained or reconstructed:

- stable identities;
- resolved configuration;
- events/logs;
- artifacts/results;
- decisions/approvals;
- usage/resource consumption;
- nested calls;
- redaction, truncation, retention, or completeness indicators.

Do not treat the agent's final summary as the only evidence of external effects.

## Evidence-backed observations

For each material observation, record:

- **Claim:**
- **Scope:**
- **Evidence type:** primary documentation / source code / release note / live test / synthetic test / operator report
- **Evidence:**
- **Limitations/unknowns:**

Documentation and source inspection are not live behavioral verification.

## Optional Harness Operations mapping

Only after the native description is complete, map shared concepts where the mapping clarifies the system.

| Native concept or behavior | Harness Operations concept/pattern | What the mapping clarifies | What it does not preserve |
| --- | --- | --- | --- |

Omit mappings that add vocabulary without adding understanding.

## Open questions and limitations

List unknowns explicitly. Missing documentation is normally unknown, not affirmative evidence of unsupported behavior.

State any evidence freshness, inaccessible configuration, unavailable live test, or dependency that limits the entry.
