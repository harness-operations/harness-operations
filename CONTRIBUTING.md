# Contributing to Harness Operations

This project maintains a canonical reference for Harness Operations: concrete systems, operating patterns, comparisons, standards boundaries, and deeper conceptual material.

Contributions should improve the accuracy of the Systems reference, the usefulness of the operating patterns, or the quality of the reference material without turning unlike systems into one architecture or product ranking.

## Where changes start

Use a GitHub Issue when a proposed change:

- changes the project's scope, proposition, or inclusion rules;
- introduces or changes a core reference concept;
- changes the comparison or assessment methodology;
- affects more than one canonical document;
- changes the relationship to an external standard;
- introduces a substantial new system entry, profile, benchmark, or proposal.

Small editorial fixes that do not change semantics may go directly to a focused Pull Request.

## Pull Requests

Canonical content changes through Pull Requests.

A Pull Request should:

1. link the Issue or design discussion it implements when one exists;
2. explain the semantic change, not only the file change;
3. identify external standards or prior art affected by the change;
4. keep the change focused enough to review meaningfully;
5. separate documented, source-inspected, synthetic-test, and live-tested claims;
6. resolve material review objections before merge.

## Systems reference guardrails

A subject belongs in Systems when it demonstrates or clarifies a material agent execution loop, specialization mechanism, operational constraint, coordination pattern, evidence boundary, or failure behavior.

Do not include a product merely because it contains an LLM.

A reference entry should:

- identify what the subject actually is rather than labeling every subject a Harness;
- describe the subject's native concepts before mapping them to Harness Operations vocabulary;
- scope claims to the reviewed interface, release/commit or hosted observation date, deployment mode, configuration, and evidence;
- distinguish a model's task quality from a Harness's operational behavior;
- distinguish an agent Harness from benchmark/evaluation harnesses, fuzzing harnesses, workflow/render engines, models, and prompt/skill packages;
- treat standalone and cooperative arrangements as different shapes, not maturity levels;
- distinguish documented relationships from operation-specific tested interoperability;
- make unknowns and material limitations explicit.

Use first-party documentation, source, release notes, or reproducible evidence for substantive external claims where practical. Community or operator reports can add context but should be labeled as such.

The [system reference template](systems/TEMPLATE.md) is the starting contract for new entries.

## Structured comparison guardrails

The structured comparison dataset exists to make scoped operational differences inspectable.

Do not infer support from marketing categories, protocol names, or product-family branding. Keep capability, delivery mechanism, evidence type, test result, freshness, and limitations distinct.

A Systems reference entry does not need a complete capability row merely to be published. Complete comparison rows remain a stricter data product and should be created only when the relevant scope has actually been reviewed.

## Reference-model guardrails

A concept belongs in the Reference Model only when it is justified by a cross-Harness operational need. Concepts that exist only because one product, vendor, deployment, domain, or architecture needs them should remain native system detail, an implementation pattern, or an example until broader evidence supports inclusion.

Where an existing open standard already defines applicable semantics, Harness Operations should describe the relationship to that standard rather than create parallel semantics without a demonstrated gap.

## AI-assisted contributions

Material use of AI assistance should be disclosed in the Pull Request description. The contributor remains responsible for the accuracy, originality, licensing, and reviewability of the contribution regardless of the tools used to produce it.

## Proposals

The `proposals/` directory is reserved for changes that are too substantial to review effectively as an ordinary Issue and Pull Request.

Harness Operations does not currently define a formal RFC process, voting system, working groups, or standards-body procedure. Those mechanisms should be introduced only if real contributor scale and decision pressure justify them.

## Normative language

The Harness Operations Reference Model is descriptive. Do not use RFC 2119 or RFC 8174 `MUST`, `SHOULD`, or similar keywords as Reference Model conformance requirements.

Any implementation specification or use-case profiles must be separately identified, reviewed, and released. Do not silently turn descriptive Reference Model text into normative product requirements.

## Licensing

Unless explicitly stated otherwise, contributions to this repository are made under the Apache License, Version 2.0. By contributing, you affirm that you have the right to submit the contribution under that license.

## Project governance and system governance

This file describes how contributions to the project are reviewed.

Governance of Harness Operations systems—authority, ownership, policy, delegation, approval, exceptions, budgets, change control, and accountability—is a separate subject described by the reference material.
