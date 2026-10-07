# Contributing to Harness Operations

Help people learn what AI-agent capabilities exist, understand their trade-offs,
and investigate reviewed tools. Contributions should improve accuracy, usefulness,
or accessibility—not prescribe one architecture or rank unlike products.

## Where changes start

Use a GitHub Issue for changes to project scope, catalog inclusion, discovery rules,
comparison methodology, multiple canonical documents, a substantial new system
entry, or benchmark work. Small editorial fixes may go directly to a focused PR.

## Pull requests

Link the issue, explain the meaningful change, keep the scope reviewable, identify
affected evidence and external interfaces, and address material review findings
before merge. Content, discovery rules, generated pages, and tests are reviewed
together in this repository.

Material AI assistance should be disclosed in the PR description. The contributor
remains responsible for accuracy, originality, licensing, and reviewability.

## Reviewed entries

A subject belongs in the catalog when it teaches something material about how
agent work is carried out. Do not add a product only because it contains an LLM.

Describe the subject in its own terms. Identify whether it is an application,
harness, model, tool interface, framework, or other component; do not imply these
are interchangeable. Scope claims to the reviewed interface, version/revision or
hosted observation date, deployment, configuration, and evidence. Keep documented
relationships distinct from tested interoperability, and make unknowns explicit.

Prefer first-party documentation, source, release notes, and reproducible tests.
Label operator reports, inference, and untested claims. Use the
[entry template](systems/TEMPLATE.md) as an editorial aid, not a product requirement.

## Capability guides and discovery

Guides explain possibilities, examples, and trade-offs. They are not a checklist
that every tool must satisfy. Link to canonical evidence rather than maintaining a
second vendor-feature catalog.

Chooser suggestions must follow explicit, tested rules over reviewed metadata.
Explain every match; keep exact interfaces and setup boundaries visible. Missing
information does not establish a capability or satisfy a mandatory constraint.
Reject unsupported constraints rather than silently ignoring them. No weighted
quality scores, fit percentages, security grades, or universal winner.

Do not infer offline operation, local inference, privacy, pricing, licensing, or
current availability from a product name, local CLI, or self-hosted runtime. A
coverage gap means the catalog needs more evidence, not that no suitable tools exist.

## Comparisons and tests

Keep finding, mechanism, evidence type, test outcome, freshness, scope, and
limitations distinct. Missing observations, unknown, unsupported, partial, and
not-applicable are different states. More visible capabilities do not establish
better performance or fit. A system entry need not have a complete comparison row.

Run canonical validators, unit tests, the site build/link checks, and browser tests
for relevant changes. Include keyboard, focus, narrow-screen, and no-JavaScript
behavior in interactive work. Preserve source links and historical routes.

## Historical material and new proposals

Earlier design notes are archived for provenance and existing links. New guides
should not revive them as architecture or conformity requirements. Published
releases and past evidence retain their original meaning.

The `proposals/` directory is available for substantial designs. Any future
implementation specification, profile assessment, or benchmark must be explicitly
scoped and separately reviewed. Discovery does not depend on conformity assessment.

## Licensing and project governance

Contributions are under the Apache License, Version 2.0 unless stated otherwise.
Contributors must have the right to submit their work. This document describes
project review, not the authority or permission model of any agent system.
