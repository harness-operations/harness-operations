# Cisco Antares models

**Subject kind:** model  
**Workload:** software-security vulnerability localization  
**Reviewed:** September 30, 2026

Primary sources:

- [Antares-1B model card](https://huggingface.co/fdtn-ai/antares-1b)
- [Antares technical report](https://arxiv.org/abs/2608.02407)
- [Cisco release post](https://blogs.cisco.com/ai/introducing-antares-the-most-efficient-open-weight-ai-models-for-vulnerability-localization)

## Operational relevance

Antares demonstrates specialization that lives substantially in **model weights and training**, rather than only in prompts or tools loaded into a general-purpose Harness.

The technical report describes a family for agentic vulnerability localization. Cisco's public release announcement made Antares-350M and Antares-1B available as open-weight models; the report also evaluates a 3B member.

## Native task and action format

Antares-1B is trained for **file-level vulnerability localization**. Given a CWE category description and a repository, it generates repository-exploration actions through a terminal-oriented tool format.

The model card describes surrounding infrastructure that executes shell commands, returns tool responses, and repeats until the model submits candidate vulnerable files or reports no vulnerability. The documented loop permits up to 15 terminal calls.

The weights alone do not execute commands, mount repositories, isolate filesystems, or enforce the inspection budget. Those are responsibilities of the surrounding runtime or Harness.

## Completion and quality

Completion is deliberately narrow: return likely affected **files** for the requested weakness category.

The model card limits the task to file localization. It does not make proof-of-concept exploitation, line-level localization, explanation, or remediation part of the required output.

This makes Antares a useful contrast with Foundry, whose architecture seed covers a broader finding lifecycle.

## Execution boundary

The model is intended to support local deployment. That does not mean every Antares-based application keeps code local: the actual data boundary depends on the inference endpoint and Harness.

The separate [Antares CLI entry](antares-cli.md) matters because a local CLI can still call a remote inference service.

## Operational lessons

- Model benchmark quality and Harness operational behavior are different dimensions.
- Specialization can live below the Harness.
- Domain-specific completion can be intentionally narrower than an end-to-end workflow.

## Limitations

This reference entry is documentation/model-card backed. Harness Operations did not execute the Antares models. Published model benchmark results should not be treated as permissions, isolation, recovery, or interoperability guarantees for downstream systems.
