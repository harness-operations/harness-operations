# Agent Evaluation

**Subject:** Inspect AI  
**Workload:** agent evaluation, model evaluation, benchmarking  
**Reviewed:** October 5, 2026  
**Reviewed revision:** `6bea9cd4f6981bf50703284e1595710e8dec6ad4`

Primary sources:

- [Inspect AI repository at reviewed revision](https://github.com/UKGovernmentBEIS/inspect_ai/tree/6bea9cd4f6981bf50703284e1595710e8dec6ad4)
- [Inspect: Using Agents](https://inspect.aisi.org.uk/agents.html)
- [Inspect: Agent Bridge](https://inspect.aisi.org.uk/agent-bridge.html)
- [Inspect tutorial](https://inspect.aisi.org.uk/tutorial.html)
- [Inspect: Agent Checkpointing](https://inspect.aisi.org.uk/checkpointing.html)
- [Inspect: Agent Intervention](https://inspect.aisi.org.uk/intervention.html)
- [Inspect: Tool Approval](https://inspect.aisi.org.uk/approval.html)
- [Inspect: Tool Result Review](https://inspect.aisi.org.uk/review.html)

## Operational relevance

Inspect introduces a distinct relationship that the other Systems entries do not:

> **an evaluation runtime operates an agent as the system under test.**

That is different from an agent using Playwright to test software, and different from a benchmark result itself.

The evaluation runtime supplies task setup, model/provider configuration, sandboxing, limits, scoring, logs, retries, and recovery around the agent being evaluated.

## Agent surfaces

Inspect documents several ways to run agents, including:

- built-in ReAct Agent;
- Deep Agent with subagent delegation, memory, and planning;
- software-engineering agents such as Claude Code and Codex CLI through Inspect SWE;
- custom agents;
- third-party frameworks through Agent Bridge;
- a Human Agent for human baselines.

This means "Inspect evaluates an agent" does not imply one universal agent implementation.

## Agent Bridge

Agent Bridge supports at least two materially different placements:

- Python agents running in the same process as Inspect;
- agents running in a sandbox and bridged back to Inspect.

Inspect documents the bridge as routing the agent's model-calling functions through the current Inspect model provider.

That can intentionally change part of the execution boundary relative to how the agent normally runs outside an evaluation.

Current Agent Bridge documentation also makes two evaluator-owned controls explicit:

- provider-hosted capabilities such as web search, code execution, and remote MCP access can be withheld from sandboxed bridged agents unless the evaluation grants them;
- approval policies can reject or modify bridged tool calls before the response reaches the agent, preventing the rejected call from executing.

Those controls can materially change observed safety and capability. They belong to the evaluator composition, not the bare Harness under test.

Inspect's separate tool-result review mechanism does **not** currently apply to tool results executed inside bridged agents' own tool loops, so "Inspect governs bridged tools" must not be generalized into one uniform review boundary.

Results therefore belong to the **tested composition**:

```text
evaluation task
  + Inspect configuration
  + agent / Harness
  + model/provider
  + sandbox/environment
  + tools
  + scorer
```

They should not be attributed to the bare Harness alone.

## Sandboxing

CLI-based agents such as coding agents can perform filesystem and process effects, so Inspect's agent-evaluation paths can run them in sandboxes.

The evaluator's sandbox is an **outer test boundary**.

If the evaluator blocks an action, that does not prove the Harness under test would have blocked the same action in its native environment.

Likewise, evaluator-provided retries, checkpointing, or model routing must not be credited as native Harness capabilities.

## Checkpointing and intervention

Inspect documents capabilities suited to long-horizon agent evaluations including:

- checkpointing to recover from failures;
- intervention to communicate with running agents;
- token, message, and time limits.

The current checkpointing documentation marks that feature as requiring the development version of Inspect. It restores registered agent state, selected sandbox filesystem state, and Inspect store/event history at checkpoint boundaries; it does **not** restore arbitrary process memory, running tools, sockets, or external side effects.

These are evaluator controls over the execution under test.

They create useful evidence about reliability and operator intervention, but they must remain attributable to Inspect rather than silently becoming properties of the evaluated agent. Evaluator checkpoint recovery must also not be reported as native Harness recovery.

## Eval sets, retry, and resume

Inspect supports evaluation sets that run tasks across multiple models and can retry/resume interrupted evaluation work from logs.

That is different from the evaluated agent itself supporting task resume.

The distinction matters for Harness Operations benchmarks: evaluator recovery should not mask agent recovery failures.

## Scoring and completion

Evaluation completion has at least two layers:

1. did the agent/runtime execution reach its own terminal outcome;
2. did the evaluator obtain enough evidence to score that outcome.

An agent can complete while failing the task. An evaluation can also fail to produce a valid score because the runtime, sandbox, grader, or evidence path failed.

Those states should remain separate.

## Relationship to Harness Operations benchmarking

Inspect is relevant infrastructure for Harness Operations benchmark work because it already provides many evaluator concerns that a harness benchmark needs:

- repeatable task execution;
- sandboxing;
- limits;
- recovery;
- agent integration;
- scoring/logging.

That does **not** mean Harness Operations should adopt Inspect as a required benchmark runtime. It is prior art and a candidate implementation substrate.

## Evidence and limitations

This entry is documentation/source backed.

Harness Operations did not run Inspect, Inspect SWE, Agent Bridge, Claude Code, or Codex through an evaluation in this pass.

The documented support for Claude Code and Codex CLI establishes product-family evaluation relationships in prose. They are not attached to the exact scoped Claude Code CLI or Codex App Server subjects in the systems index, and they are not Harness Operations-tested compatibility results.
