# Claude Projects (beta)

**Area:** orchestrated project work  
**Workloads:** coding, long-running multi-part project work  
**Operational characteristics:** coordinated, parallel, threaded, long-running, background, shared-memory  
**Reviewed:** October 5, 2026

Primary sources:

- [Projects redesigned: from folder to conversation](https://claude.com/blog/projects-redesigned)
- [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- [Claude Help Center: What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects)
- [Claude Code: Features overview](https://code.claude.com/docs/en/features-overview)

## Operational relevance

The redesigned Claude Projects beta adds a concrete hierarchical orchestration shape that is different from a single Claude Code session, an agent team, shared-state workers, or one agent invoked as a tool.

The documented hierarchy is:

```text
Project / coordinator conversation
        │
        ├── Thread A — Claude Code session
        │       ├── cloud, or
        │       └── user's machine via Remote Control
        │
        ├── Thread B — Claude Code session
        │       ├── cloud, or
        │       └── user's machine via Remote Control
        │
        └── Thread N — Claude Code session
                └── optional subagents / loops / workflows
```

A Project can therefore mix execution placements: one thread may run in Anthropic's cloud while another runs on a user's machine when the task needs local files, tools, MCP servers, devices, databases, or network access.

The coordinator scopes work, routes it to new or existing threads, monitors progress, reviews results, and assembles the overall outcome.

This entry treats Projects as an **application + control layer** over worker sessions, not as the same surface as the local Claude Code CLI.

## Beta scope

The redesigned Projects experience is in beta and rolling out in stages, starting with Claude Code.

Current help documentation says the beta is available to selected Pro and Max users with Claude Code access, with broader rollout planned later.

Existing legacy Projects continue to operate under their previous semantics during the transition.

This entry applies only to the redesigned beta described in the cited current sources. It does not silently apply these semantics to legacy Projects, chat Projects, Cowork Projects, or future local-thread execution.

## Coordinator and threads

Anthropic describes Projects as one coordinator conversation with worker threads that do the underlying work.

The user can:

- set a project goal and supply repository or other context;
- configure the cloud environment, connectors, plugins, instructions, and model;
- monitor and steer through the main project chat;
- open an individual thread to inspect or steer its work.

The coordinator can route work to new or pre-existing threads rather than requiring the user to manually divide and stitch together every subtask.

## Worker-session boundary

Each thread is a Claude Code session, but the **execution placement is configurable**.

### Cloud thread

A cloud thread runs in the Project's configured cloud environment. For repository work, Anthropic documents cloud threads as working from cloned repositories with isolated branch/workspace state.

Cloud execution determines the thread's available network access, environment variables, credentials, setup scripts, connectors, plugins, and repository-derived configuration.

Cloud threads can continue after the user's computer disconnects.

### Machine thread

When a task needs something available only on a user's computer, a Project can run that thread on the machine through Claude Code Remote Control.

A machine thread uses that machine's:

- local files/folder;
- tools and binaries;
- MCP servers;
- Claude Code settings;
- hooks and permission rules;
- local/private network reachability.

Unlike a cloud thread, a machine thread depends on that computer remaining awake and Remote Control remaining available.

The Project's other threads can continue running in the cloud at the same time.

### Isolation and conflicts

Execution placement changes the worker boundary. Cloud and machine threads must not silently inherit one another's filesystem, tools, credentials, permissions, or availability.

For cloud repository work, parallel threads can still produce ordinary source-control merge conflicts. Coordinator-level orchestration does not imply transactional multi-thread updates or automatic conflict-free integration.

The current Systems reference has a separately scoped **Claude Code CLI** entry. Project worker threads can include machine-based Claude Code sessions, but the Projects documentation does not establish that every worker has the exact local CLI version/configuration reviewed in that separate entry, so no exact machine relationship is asserted.

## Nested delegation

A Project thread can further decompose work with subagents, loops, and workflows.

That creates a potentially nested hierarchy:

```text
human
  → project coordinator
      → cloud worker thread
          → subagent / loop / workflow
```

Operator controls, limits, evidence, and cancellation should therefore be analyzed at the level where they actually apply rather than assuming the project coordinator directly owns every inner action.

## Shared memory, instructions, and Library

Project-level context is not identical across execution placements.

Cloud threads draw on the Project's configured repositories, instructions, memory, Library, plugins/connectors, and cloud environment according to the current Projects documentation.

A machine thread started through Remote Control receives the Project instructions but uses the machine's local execution environment. Current documentation says it does **not** load the Project memory files in the same way a cloud thread does.

The Project Library still provides a project-level artifact/file surface, but the existence of shared Project context does not establish that every thread transcript, tool call, local file, credential, or private intermediate state is globally shared.

This makes context propagation itself an operational boundary: coordinator context, Project memory, cloud-thread context, and machine-thread local state are related but not interchangeable.

## Long-running execution

The redesigned Project is intended for work spanning more than one reply and more than one component.

Execution lifetime depends on worker placement:

- **cloud threads** can continue after the user's laptop disconnects;
- **machine threads** require the selected computer to remain awake with Remote Control available.

A Project can therefore remain active while some workers are independent of the user's device and others are device-coupled.

The coordinator–worker arrangement should not be reduced to a single "background" guarantee, and continuation of cloud work does not establish that every nested task or external effect is retry-safe, exactly-once, or automatically recoverable.

## Human steering

The main coordinator conversation remains an operator surface while threads run in parallel.

The operator can steer overall work through the project chat or drill into an individual thread to guide a specific worker.

That creates at least two intervention scopes:

- coordinator-level steering;
- worker-thread-level steering.

The public material reviewed here does not establish one universal cancellation/revocation contract spanning coordinator, worker threads, nested subagents, and already-completed external effects.

Those semantics should remain scoped and unknown where not documented.

## Resource and model configuration

Projects can run multiple threads concurrently, and Anthropic notes that this can consume plan usage faster.

The coordinator and worker threads can have model/effort choices.

Resource accounting should therefore distinguish at least:

- project/coordinator usage;
- individual worker-thread usage where exposed;
- nested work;
- overall project limits.

Parallelism should not be interpreted as free concurrency.

## Completion

Project completion is broader than one worker thread finishing.

A coordinator may need to:

- wait for multiple threads;
- identify blocked or failed work;
- review thread outputs;
- reconcile artifacts or branch dependencies;
- communicate what is complete and what still requires user action.

A thread successfully opening a pull request is not automatically equivalent to the overall project goal being satisfied.

## Relationship to other orchestration shapes

### Not an agent team by default

Claude Code agent teams are peer sessions with their own coordination semantics.

Projects instead expose a coordinator that directs worker threads from a main project conversation.

A worker thread may itself use subagents or other Claude Code orchestration features, but that does not make the Project topology equivalent to an agent team.

### Not shared-state workers

Projects do expose shared project memory and a Library, but the documented control structure is coordinator → worker threads rather than interchangeable workers claiming work from a deterministic shared queue.

### Not durable-workflow orchestration

Projects are designed for long-running agentic work, but the reviewed sources do not establish Temporal-style durable workflow replay, compensation, or exactly-once effect semantics.

## Evidence and limitations

This entry is documentation-backed.

Harness Operations did not have beta access and did not execute a Project, inspect worker-session events, test failure recovery, exercise merge conflicts, measure resource accounting, or verify coordinator/worker cancellation behavior.

Because this is a staged beta and the product changed after the launch announcement, availability and behavior may change. Claims here are scoped to the current Projects documentation and redesigned beta as reviewed on October 5, 2026; the launch blog's cloud-only statement is historical rather than the current execution-placement boundary.
