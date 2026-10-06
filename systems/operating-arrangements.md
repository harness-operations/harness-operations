# Operating Arrangements

Operating arrangements describe **where the agent loop lives and how work crosses boundaries**.

They are not maturity levels. A narrow standalone specialist can be the correct architecture; a multi-agent fleet can be unnecessary complexity.

Not every important operational difference is an arrangement. [Realtime Voice](realtime-voice.md) and [Background Execution](background-execution.md) are **execution characteristics** that can appear inside several arrangements. [Agent Evaluation](agent-evaluation.md) is an **evaluation context** in which another agent or Harness is the system under test.

## 1. Standalone bounded execution

A Harness accepts a bounded objective, performs its own loop, and returns a result or artifact without requiring another agent system.

Examples include [Antares CLI](antares-cli.md), Browser Use's open-source Agent, Claude Code, and Codex.

Questions: What bounds the work? What counts as completion? What side effects are possible? What evidence remains?

## 2. Interactive supervised work

A human and Harness share an ongoing interaction in which the operator can steer, approve, correct, or interrupt work.

Examples include Claude Code CLI, FireRed-OpenStoryline's conversational workflow, and browser automation driven interactively through an outer coding agent.

Human attention and intervention are normal operational states in this arrangement.

## 3. Embedded specialization

A general Harness is specialized through instructions, skills, tools, or role definitions while retaining the host Harness's lifecycle and controls.

Examples:

- [Playwright Test Agents](playwright-test-agents.md) generated for Claude Code, Codex, VS Code, or OpenCode;
- FireRed-OpenStoryline Agent Skills loaded into compatible outer agents;
- Browser Harness supplying browser workflow and control to an existing agent;
- [Computer Use](computer-use.md) tool interfaces and macOS Harness supplying desktop-control capability while an outer application/Harness retains the agent loop.

The specialization should not be credited with host-level permissions, persistence, or sandbox guarantees it does not implement.

## 4. Agent or Harness as a tool

One agent system delegates a bounded objective to another agent system and receives its result.

Browser Use documents task/MCP patterns where an outer system can invoke a browser agent for a subtask.

This differs from exposing low-level browser actions directly: the delegated agent owns an inner loop.

Relevant questions include child identity, delegated authority, cancellation, returned evidence, retries, and external effects.

## 5. Durable artifact handoff

Work crosses a boundary through an artifact inspectable independently from the private context that produced it.

Examples:

- Playwright planner → Markdown plan → generator → executable tests;
- FireRed-OpenStoryline media/script/editing artifacts and reusable skills;
- Foundry findings, reports, and rule-gap/rule-corpus updates.

Artifact handoff can connect work across time without two live agents communicating.

## 6. Coordinator–worker threads

A coordinator decomposes and routes work across multiple worker sessions, monitors progress, and assembles the overall result.

[Claude Projects (beta)](claude-projects.md) is a concrete example: the main Project conversation acts as coordinator while parallel Claude Code worker threads perform delegated work. Individual workers can run in the cloud or on a user's machine via Remote Control, and can further use subagents, loops, or workflows.

This differs from agent-as-tool delegation because the coordinator can maintain and steer a set of concurrent worker sessions as one higher-level body of work.

It also differs from shared-state workers: the documented topology is hierarchical coordinator → workers rather than interchangeable workers claiming units from a deterministic queue.

Relevant questions include:

- who creates and owns worker-session identity;
- what context is shared versus private to each worker;
- how coordinator and worker intervention differ;
- how failures/blocked work surface to the coordinator;
- how artifacts and branch dependencies are reconciled;
- how execution placement changes tools, credentials, network reachability, context, and lifetime;
- how limits and usage aggregate across nested execution;
- whether cancellation or authority changes propagate to already-running descendants.

## 7. Shared-state or queue-based workers

Several agent workers coordinate through deterministic shared infrastructure.

[Foundry](cisco-foundry-security-spec.md) is a strong example: roles coordinate through a work queue, finding store, heartbeat liveness, claims, budgets, and substrate services.

This should not be reduced to "agents talk to each other." The shared substrate is part of the operational system.

## 8. Independent systems communicating across an explicit interface

Independent systems may exchange tasks, messages, artifacts, or state through an API or protocol while retaining separate internal lifecycles.

A2A is one standards example in [Standards and Boundaries](../reference/standards.md).

The reference does not invent a product pairing merely to populate this category. A documented protocol implementation is not by itself a demonstrated cross-product operation.

## Relationship to the systems index

[index.json](index.json) records source-backed structural relationships such as `hosts_definition`, `uses_model`, `invokes`, `supplies_tools_to`, and `evaluates`.

Those records deliberately do not carry live compatibility status.

A specific exercised source/target operation belongs in `comparisons/data/systems.json` with directional interface scope and evidence.

## Do not infer

- More agents is not more mature.
- A compatible skill format is not runtime interoperability.
- MCP exposure is not evidence that the caller owns the tool runtime.
- A shared output format is not proof of safe handoff.
- A successful outer invocation is not proof that every inner operation succeeded.
- Hosted and local surfaces from one vendor should not silently share findings.
- A Computer Use tool interface is not automatically a Harness, and a product named Harness may still function as a capability layer inside another Harness.
