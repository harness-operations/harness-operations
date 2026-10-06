# Playwright Test Agents

**Subject kind:** agent definitions  
**Workload:** software test planning, generation, and repair  
**Reviewed:** September 30, 2026  
**Documentation scope:** current Playwright documentation; Test Agents introduced in Playwright 1.56, current release notes at review time include 1.61

Primary sources:

- [Playwright Test Agents](https://playwright.dev/docs/test-agents)
- [Playwright release notes](https://playwright.dev/docs/release-notes)

## Operational relevance

Playwright Test Agents show that domain specialization does **not** require a new standalone Harness.

Playwright provides planner, generator, and healer definitions that are generated into an existing agentic loop such as VS Code, Claude Code, Codex, or OpenCode.

## Native roles

- **planner** explores an application and writes a Markdown test plan;
- **generator** converts that plan into executable Playwright Test files and verifies selectors/assertions while generating;
- **healer** executes a failing test, explores the current UI, proposes repairs, and re-runs until it passes or guardrails stop the loop.

Playwright describes the generated definitions as collections of **instructions and MCP tools** and says they should be regenerated when Playwright is updated.

## Where the loop lives

The `init-agents` command generates definitions for a selected host loop. Documented hosts include VS Code, Claude Code, Codex, and OpenCode.

The Playwright roles therefore specialize an existing Harness rather than defining one universal Playwright session lifecycle.

This is a clear example of **embedded specialization**.

## Artifacts and handoffs

The workflow produces durable repository artifacts: seed tests, Markdown plans under `specs/`, and generated Playwright tests under `tests/`.

A typical flow is planner → Markdown plan → generator → Playwright tests → healer on failure.

## Completion semantics

Playwright documents that the healer can output either a passing test **or a skipped test if it believes the functionality itself is broken**.

Therefore "healer completed" must not be rendered as "the application is correct" or even necessarily "the test passes normally."

## Testing software is not evaluating agents

This subject uses agents to **test software**.

That is a different workload from **evaluating an agent or Harness**. Evaluation frameworks such as [Inspect](https://inspect.aisi.org.uk/) can run agentic tasks and external agents including Claude Code and Codex CLI, score their outcomes, enforce limits, and collect evaluation evidence.

Harness Operations should not put Playwright Test Agents and an agent-evaluation runner into one product category simply because both use the word "test."

## Authority and effects

These roles can drive a browser and write test/spec files through the host agent's tools.

The actual permission prompts, filesystem policy, process isolation, credentials, and session persistence belong to the selected host Harness and surrounding environment. The Playwright definition should not be credited with controls supplied by Claude Code, Codex, VS Code, or another host.

## Relationships versus interoperability

Playwright documents generation for Claude Code and Codex. Those are source-backed **product-family hosting relationships** in this entry, but the systems index does not attach them to the exact scoped Codex App Server or Claude Code CLI subjects because the upstream documentation does not establish those exact versions/surfaces.

Harness Operations did not live-test the generated definitions inside the exact Codex and Claude Code surfaces in the current Systems reference. The documented product-family relationships are not compatibility results.

## Limitations

This reference entry does not benchmark generated test quality or exercise planner → generator → healer end to end. The documentation is rolling; a future live test should preserve the generated definition revision and host configuration.
