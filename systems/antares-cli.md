# Cisco Antares CLI

**Subject kind:** Harness  
**Workload:** bounded software-security vulnerability localization  
**Reviewed:** September 30, 2026  
**Version scope:** companion CLI described by the Antares-1B model card; no independent standalone CLI version identifier is asserted here

Primary source:

- [Antares-1B model card](https://huggingface.co/fdtn-ai/antares-1b)

## Operational relevance

Cisco's model card states that the companion CLI packages the complete Antares agent loop, analyzes a **read-only repository snapshot**, connects to a user-configured **OpenAI-compatible inference endpoint**, and returns candidate vulnerable files in human-readable, JSON, or SARIF forms.

The model and CLI remain distinct: the model generates actions and localization output; the CLI supplies the operational loop and repository boundary.

## Workload and completion

The CLI's job is **localization**, not full vulnerability lifecycle management.

A successful result is a bounded set of candidate files for analyst review. The cited material does not make the CLI a proof-of-exploit validator, remediation agent, or complete security-evaluation platform.

This narrowness is not a failure to implement Foundry. They solve different-sized problems.

## Execution, data, and inference

The repository snapshot is documented as read-only.

The inference endpoint is user-configured and OpenAI-compatible. Consequently:

- the CLI can be local while inference is remote;
- repository data supplied to the model follows the configured inference path;
- "CLI runs locally" must not be rendered as "source never leaves the machine" without reviewing configuration.

## Independent and cooperative use

The primary arrangement is **standalone bounded execution**.

JSON and SARIF provide artifact boundaries that downstream systems can consume, but an output format does not establish live compatibility with Foundry, CI systems, coding Harnesses, or other scanners.

## Unknowns

The reviewed public material does not establish generic semantics for restart/resume, in-flight cancellation, retry/idempotency, or durable audit reconstruction after partial execution. Those remain unknown rather than unsupported.

## Limitations

Harness Operations did not execute the CLI or inspect the downloadable artifact in this pass. Exact standalone CLI versioning and deeper implementation details should be added when a stable versioned artifact or source interface can be cited.
