# Browser Use: three placements of browser-agent capability

**Workload:** browser automation and web tasks  
**Reviewed:** September 30, 2026

Reviewed revisions:

- Browser Use open-source repository: `4cbe921673b48a488f5415d9159249afd12a625b`
- Browser Harness repository: `afbcc381b963040c19627d788e40c7e7663171ee`

Primary sources:

- [Browser Use at reviewed revision](https://github.com/browser-use/browser-use/tree/4cbe921673b48a488f5415d9159249afd12a625b)
- [Browser Harness at reviewed revision](https://github.com/browser-use/browser-harness/tree/afbcc381b963040c19627d788e40c7e7663171ee)

## Operational relevance

The same project family documents **three materially different placements**:

1. a fully hosted agent and browser;
2. Browser Harness capability supplied to an existing agent;
3. an open-source Python Agent embedded in an application.

A statement such as "Browser Use supports X" is ambiguous unless the surface is named.

## Placement 1: fully hosted agent

Browser Use documents a Cloud path in which the service runs both the agent and browser infrastructure.

Operational questions about provider-side agent state, browser profiles, recordings, and service lifecycle belong to that hosted surface and must not be inferred for the open-source library.

## Placement 2: Browser Harness supplies browser capability to another agent

The separate Browser Harness project documents connecting an existing coding agent such as Claude Code or Codex to a real browser through CDP.

It includes an install flow, a Skill teaching the browser workflow, reusable helpers, and an MCP server exposing browser-control helpers over stdio.

In this arrangement the **outer coding Harness remains the agent loop**. Browser Harness supplies browser capability and workflow guidance.

This is embedded specialization/capability supply, not evidence that the systems share one session lifecycle.

## Placement 3: open-source Python Agent

The Browser Use library exposes an `Agent` accepting a task, model, browser, and optional tools, then runs a browser-agent loop from application code.

The library can use a local or cloud browser and multiple model providers.

This is an embeddable Harness surface: the application owns the surrounding process while Browser Use owns the inner agent loop.

## Data and credential boundaries

The three placements differ materially:

- a local Python Agent may call a remote model;
- the Python Agent can drive a local or cloud browser;
- Browser Harness can connect an outer agent to a real local browser;
- the hosted API runs agent and browser in Browser Use infrastructure.

"Browser automation" does not determine where state, cookies, model context, or credentials live.

## Completion and external effects

Browser tasks can create real side effects: form submissions, bookings, account changes, downloads, uploads, and messages.

A final textual answer is not sufficient evidence of those effects. Later operational tests should inspect authoritative browser/application state where possible.

## Agent-as-tool delegation

Browser Use documentation also describes MCP/task patterns in which an outer system delegates a bounded browser task to a Browser Use agent.

That differs from Browser Harness, where the outer agent drives browser helpers directly.

The reference should preserve the difference between **supplying tools to the caller** and **invoking another agent to perform a subtask**.

## Limitations

This is source/documentation inspection only. Harness Operations did not run the hosted service, attach Browser Harness to a personal browser, or execute cross-Harness delegation.

Hosted behavior and rolling docs can change independently from the reviewed open-source commits.
