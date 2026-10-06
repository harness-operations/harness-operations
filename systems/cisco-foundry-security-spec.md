# Cisco Foundry Security Spec

**Subject kind:** domain-specific specification / architecture seed  
**Workload:** authorized AI-assisted software-security evaluation with source access  
**Reviewed:** September 30, 2026  
**Repository revision:** `c770bf7764265dda188d9a270b1105a4bb62759b`  
**Seed specification:** 0.1.0  
**Constitution:** 0.2.0

Primary sources:

- [Repository at reviewed revision](https://github.com/CiscoDevNet/foundry-security-spec/tree/c770bf7764265dda188d9a270b1105a4bb62759b)
- [Seed specification](https://github.com/CiscoDevNet/foundry-security-spec/blob/c770bf7764265dda188d9a270b1105a4bb62759b/spec.md)
- [Constitution](https://github.com/CiscoDevNet/foundry-security-spec/blob/c770bf7764265dda188d9a270b1105a4bb62759b/constitution.md)

## Operational relevance

Foundry is deliberately **not executable code**. Cisco describes it as an organization-neutral seed specification distilled from internal security-evaluation systems.

It shows where a prescriptive architecture can be appropriate when the workload boundary is explicit.

## Scope

The seed assumes an operator is authorized to evaluate software and has source access, with an optional running testbed.

Foundry explicitly flags black-box-only testing, unauthorized/external targets, or non-security code review as cases where core assumptions change.

Its prescriptions should therefore be interpreted inside that workload boundary, not promoted into universal Harness requirements.

## Architecture

The seed defines eight core roles: Orchestrator, Indexer, Cartographer, Detector, Triager, Validator, Reporter, and Coverage Guide, plus optional extension roles.

Those roles depend on a non-agent **substrate** with a work queue, finding store, sandbox, budget tracking, and operational state.

Foundry is therefore not just "many agents talking." Deterministic shared infrastructure carries work ownership, findings, liveness, budgets, and isolation.

## Evidence and completion

Its constitution makes **Evidence Over Assertion** a core principle: confidence is not a finding verdict.

The architecture separates detection, triage, validation, reporting, deduplication, and evidence gates.

Foundry defines "done" for an evaluation as both:

- stated coverage being credibly attempted; and
- finding yield decaying below an operator-set threshold.

That condition is meaningful for this security-evaluation workload, not a universal agent completion rule.

## Coordination and safety

Atomic claims and heartbeat-based liveness support shared-state workers and crash recovery. The constitution also requires runtime-enforced sandbox boundaries rather than prompt-only isolation and ranks operator instruction above agent-authored conclusions.

These are requirements of a Foundry-derived architecture; they are not evidence that a chosen underlying coding Harness provides them.

## Relationship to Antares

No reviewed evidence establishes that Antares CLI implements Foundry or that Foundry requires Antares.

- Antares provides specialized model/CLI behavior for vulnerability localization.
- Foundry describes a broader security-evaluation architecture and lifecycle.

## Limitations

This is source inspection of the public specification repository. Harness Operations did not build a Foundry-derived system or independently reproduce Cisco's internal production experience.
