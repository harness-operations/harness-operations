# Landscape Comparison Methodology

**Status:** Applied Harness Operations v0.4

## Purpose

The Harness Operations landscape comparison exists to make operational differences inspectable, not to rank products.

It answers two separate questions:

1. **Capability:** What can a specific product/interface/version do, by what mechanism, under what prerequisites, and with what evidence?
2. **Interoperability:** Which specific source and target interfaces have been shown to work together for a defined operation, through what boundary, and with what observed limitations?

A common protocol label, product category, or marketing claim is not sufficient evidence for either question.

## Scope and architectural roles

Entries are classified by the role being observed. A product may occupy more than one role, but observations remain scoped to one concrete interface or deployment mode.

Initial roles:

- **harness** — mediates an agent's task/session lifecycle, context, tools, execution, permissions, persistence, or interaction loop;
- **client** — interacts with or presents a Harness without necessarily owning execution;
- **control_layer** — observes or directs execution across Harnesses or environments;
- **execution_runtime** — supplies execution placement, isolation, resources, or runtime lifecycle;
- **decision_service** — produces model-informed judgments consumed by operational software;
- **other** — used only when none of the above is accurate, with an explanation.

Unlike roles must not be presented as competing implementations of the same thing.

### Cross-cutting patterns: Code Mode

Code Mode is a tool-use pattern, not a product identity or a new architectural role. It describes code-mediated orchestration of tools or APIs. Compare the concrete systems that provide it, not a generic “Code Mode” row against Harness products.

For a Code Mode observation, identify where the generated program actually executes and how its calls reach tools. Distinguish native or configured harness support, an adapter, a model-platform API, and a remote MCP server's execution facility. A client using that remote facility does not automatically gain native Code Mode support. Likewise, a model API feature does not establish support in a separate CLI or IDE surface from the same vendor.

Record the implementation/version, execution language/runtime, discovery interface, tool-call bridge, and material configuration. Review nested-call authorization, cancellation, limits, evidence, and replay separately; do not infer them from the ability to run code. A general shell, interpreter, or tool-search feature alone is insufficient evidence of this pattern.

The [Code Mode prior art](../reference/landscape.md#code-mode) motivates additional review questions, not new conformance requirements:

- **Exposure and reachability:** Which tools are directly declared, discoverable, or callable from generated code? Record the effective configuration, activation prerequisites, and adapter revision where applicable. A missing declaration is not proof of unreachability. Check that native direct-only or excluded tools cannot be reached through a prohibited nested path.
- **Dispatch and outcomes:** Do nested calls pass through the applicable validation, permission, approval, and revocation mechanisms? Preserve parent/child correlation and distinguish a thrown failure, a structured error result, and an uncertain or already-completed effect. A successful outer program is not evidence that every inner operation succeeded.
- **Evidence and limits:** What inner-call records and material model-call usage are retained, under which bounds? Identify redaction, truncation, omitted payloads, and completeness indicators separately. Check call-count, concurrency, and resource limits at the inner boundary rather than treating one program as one operation.

When tests are performed, include negative cases for prohibited invocation paths and a partial-outcome case, not only discovery or happy-path execution. Record documentation/source findings separately when these behaviors have not been exercised.

A test that starts the executor or discovers a tool establishes only that operation. It does not establish approval enforcement or safe retry for the operations inside a program. Shared Code Mode terminology is not an interoperability test.

This clarification adds no product observations or automatic capability findings. A future dedicated capability definition needs reviewed, scoped evidence for its cells; existing versioned observations should not silently inherit support.

## Observation scope

Every substantive observation identifies enough scope to avoid statements such as “Product X supports cancellation” without qualification.

At minimum, record system, interface or surface reviewed, version/release/commit or dated hosted observation, deployment mode, review date, material prerequisites, and the exact capability definition being evaluated.

If two interfaces behave differently, they receive separate observations.

## Capability finding

A capability observation uses exactly one finding:

- **available** — the scoped interface provides the defined capability within the recorded prerequisites;
- **partial** — some materially important part of the definition is missing, conditional, or narrower than the capability definition;
- **unsupported** — the scoped interface is shown not to provide the capability within the tested/documented scope;
- **unknown** — evidence is insufficient to determine support;
- **not_applicable** — the capability does not meaningfully apply to the system role or interface.

Unknown is not unsupported. Not applicable is not a failure.

An unsupported finding requires affirmative evidence within a defined scope. Absence from documentation alone is normally unknown.

## Delivery mechanism

Finding and mechanism are independent dimensions.

Mechanism may be native, configured_native, adapter, external_controller, model_mediated, or not_applicable.

A product can therefore be available through an adapter without implying native support.

## Evidence model

Evidence items use one of these types:

- primary_documentation;
- source_code;
- release_note;
- live_test;
- fixture_test;
- operator_report.

Documented behavior and observed behavior remain separate. If a live test contradicts documentation, retain both and explain the discrepancy.

Fixture evidence must never be surfaced as live compatibility evidence.

## Tested observations

A live test records environment/runtime, product/interface version or dated hosted observation, adapter/plugin revision if any, relevant configuration, exact operation, expected result, observed result, result status, and redacted evidence or reproducible commands where safe.

A passing connection test establishes only the tested operation. It does not establish approval, cancellation, revocation, recovery, artifact identity, or security semantics that were not exercised.

## Interoperability observations

Interoperability is directional and operation-specific.

A record identifies source system/interface/version, target system/interface/version, operation, transport/protocol/adapter actually used, prerequisites/configuration, evidence/test result, and limitations/unknowns.

Two systems implementing the same protocol do not automatically receive a compatibility finding.

## Freshness

Every observation carries reviewed_at.

Where practical, records also include an upstream version or source revision. A new upstream release should cause affected observations to be flagged for review rather than silently inheriting the previous result.

Stale does not automatically mean wrong; it means the observation should not be presented as current without qualification.

## Corrections and disputes

A correction should identify the exact record/capability, disputed scope or claim, primary-source or reproducible evidence, and proposed replacement finding or limitation.

Maintainer-submitted corrections follow the same evidence rules as other contributions.

## Presentation rules

Rendered views must show role and scope prominently; expose finding, mechanism, evidence type, review date, and limitations separately; provide source/test links per substantive claim; avoid color-only meaning; avoid weighted scores, rankings, “best” labels, security grades, or certification language; and state that observations are not affiliation, endorsement, or general security guarantees.

## Data-format boundary

The JSON files and schema under comparisons/ are editorial/build infrastructure for this project.

They are **not** a Harness Operations wire protocol, interchange requirement, conformance schema, or product certification format.
