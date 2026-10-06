# Computer Use: capability, execution environment, and Harness placement

**Workload:** desktop and cross-application automation  
**Reviewed:** September 30, 2026

This reference entry compares several different ways "Computer Use" can appear in an agent system. The phrase names a workload/capability, not one universal architecture.

Primary sources:

- [OpenAI API: Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)
- [OpenAI Agents API: Computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use)
- [Anthropic: Computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- [Anthropic: Tool combinations](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-combinations)
- [Browser Use macOS Harness at reviewed revision](https://github.com/browser-use/macos-harness/tree/b88e4d77403bbcac35752eef4f4dd72db3663fd6)

## Operational relevance

Computer Use expands the operational boundary beyond a browser.

A desktop-capable agent may reach applications, files, authentication state, OS-level UI, and other resources exposed by its environment. That makes execution placement, permissions, isolation, credentials, external effects, human intervention, and evidence especially important.

It also demonstrates why subject kind matters: current implementations place the capability at different layers.

## OpenAI API Computer Use: model-platform tool interface

OpenAI documents Computer Use as a way for a model to operate browser and desktop interfaces while **the application provides the environment and executes the model's requests**.

The current guide describes two application integration paths:

- code execution, where the model writes code using a UI automation library such as PyAutoGUI or Playwright; and
- the computer tool, where the model returns structured mouse/keyboard actions that the application translates into input.

This is a **tool interface**, not by itself a complete Harness. The surrounding application still owns the loop, environment, execution, credentials, approvals, persistence, and outcome verification.

## OpenAI Agents API Computer Use: hosted Harness and browser environment

OpenAI's Agents API exposes a distinct Computer Use surface in an OpenAI-hosted browser environment. OpenAI runs the agent session and browser environment while the caller starts the session, follows events, and handles required user input.

The hosted surface has its own operational semantics:

- browser activity is represented as session items;
- website-origin access and browser authentication can require application-mediated user decisions;
- a disconnected caller is expected to recover the same session rather than blindly retry the task;
- origin approval is **not** documented as confirmation for every consequential action.

OpenAI explicitly says that applications needing guaranteed confirmation before purchases, destructive changes, or similar actions should constrain the environment or use a runtime they control.

This is therefore listed separately from the client-executed Computer Use interface. Sharing the phrase "Computer Use" does not make their authority, state, or recovery semantics interchangeable.

## Anthropic Computer Use: client-executed toolset

Anthropic's current `computer_toolset_20260801` defines a client toolset for screenshots, mouse, keyboard, and related desktop operations.

Anthropic explicitly documents that **the application executes every tool call in an environment it controls** and returns the result to Claude.

The documentation also distinguishes Computer Use from the narrower Browser Use toolset: Computer Use is intended for arbitrary GUI workflows, while Browser Use is preferred when the work stays inside webpages.

Again, the trained-in tool schema does not by itself define the surrounding Harness lifecycle, sandbox, persistence, or governance model.

Anthropic also documents that this toolset is not currently available in Claude Managed Agents, reinforcing that the Computer Use capability and the managed Harness/runtime surface are distinct concerns.

## Browser Use macOS Harness: capability/runtime layer for an outer agent

The reviewed macOS Harness repository calls itself a "thin harness" and is installed by pasting setup instructions into Codex or Claude Code.

Its documented architecture is a persistent local Python process exposing raw primitives such as:

- screenshots;
- keyboard and coordinate input;
- Accessibility / Apple Events;
- Browser Harness access;
- local filesystem and subprocess access.

Operationally, the **outer coding Harness remains the model/agent loop**, while macOS Harness supplies a powerful computer-control runtime and workflow.

This is why the Systems reference treats the reviewed subject as a tool/capability layer rather than inferring subject kind from the product name alone.

## Permissions and trust boundary

Computer Use can cross more local application and operating-system trust boundaries than a browser-only integration, depending on the environment and permissions granted.

Relevant controls can include:

- OS Accessibility and automation permissions;
- filesystem and shell access;
- browser cookies and logged-in state;
- application credentials;
- network access;
- desktop/window capture;
- clipboard or other shared OS state.

Anthropic's documentation recommends a dedicated VM/container, limited privileges, restricted sensitive data, and constrained network access for Computer Use. OpenAI similarly places execution responsibility on the application/environment in its client-executed integration.

macOS Harness documents a `doctor` command that reports required macOS permissions and states that its anonymous telemetry excludes prompts, app names, screenshots, UI text, scripts, paths, and window titles. Those are properties of that reviewed layer, not universal Computer Use guarantees.

## Completion and evidence

Desktop tasks often create effects outside the agent transcript: files change, applications save state, messages send, settings change, or transactions occur.

A final model statement such as "done" is therefore not authoritative evidence of success.

Operational evaluation should inspect the actual application/OS state and distinguish:

- requested action;
- attempted action;
- committed external effect;
- failed action;
- uncertain outcome after a disconnect or lost response.

## Relationship to Browser Use

Browser Use and Computer Use overlap but should remain distinct workload views.

Browser-only systems can often use higher-level page semantics and a more constrained environment. Computer Use may cross multiple applications and OS surfaces, so its trust and failure boundaries should be evaluated separately.

The same agent system may expose both.

## Reference lessons

1. **Computer Use is a capability/workload, not a subject kind.**
2. **A tool schema is not a Harness.** OpenAI and Anthropic both document client-executed computer-control interfaces whose surrounding application owns execution.
3. **A product named "Harness" may still be a capability layer hosted by another Harness.** Native architecture matters more than branding.
4. **Desktop authority changes the operational risk profile.** Browser-only assumptions should not be silently inherited.
5. **Execution ownership must be explicit.** Hosted environments, client-controlled VMs, and a user's real desktop are materially different scopes.

## Limitations

This reference entry is documentation/source backed.

Harness Operations did not run OpenAI Computer Use, Anthropic Computer Use, or macOS Harness in this pass, did not grant desktop permissions, and did not exercise real accounts or credentials.

The documented Codex/Claude Code setup paths are product-family relationships in prose, not machine relationships to the exact scoped Codex/Claude Systems subjects and not live compatibility results.
