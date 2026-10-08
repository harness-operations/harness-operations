# Systems

Explore the reviewed agent tools, applications, and components in the catalog.
Start with an area below, or use the [capability guides](https://harness-operations.com/capabilities/)
and [guided chooser](https://harness-operations.com/choose/).

Each entry explains a concrete system in its own terms: what it does, where work
runs, what setup or integration it needs, and what the evidence does not establish.
Coverage is selective, not a complete market survey or an endorsement.

## Reviewed entries

| Area | Read about | What you are comparing |
| --- | --- | --- |
| Everyday help | [ChatGPT (personal web)](chatgpt-consumer-web.md) | Hosted chat, web lookup, uploaded documents, and optional memory; not Codex or agent actions. |
| Everyday help | [Claude (personal web)](claude-consumer-web.md) | Personal chat, search, documents, and memory; not Claude Code or Cowork. |
| Everyday help | [Gemini (personal web)](gemini-consumer-web.md) | An adult personal-account scope with explicit activity and memory prerequisites; not Workspace or device actions. |
| Everyday help | [Perplexity (personal web)](perplexity-consumer-web.md) | Cited web answers and file conversations; cross-chat memory unassessed, not unsupported. |
| Coding | [Codex App Server](openai-codex.md) | A reviewed machine-control interface, not every Codex product surface. |
| Coding | [Claude Code CLI](anthropic-claude-code.md) | The reviewed command-line interface and its operational boundaries. |
| Coordination | [Claude Projects](claude-projects.md) | The reviewed project and worker-thread arrangement. |
| Security | [Antares models](antares-models.md) and [Antares CLI](antares-cli.md) | A model and its surrounding CLI are different subjects. |
| Security design | [Cisco Foundry Security Spec](cisco-foundry-security-spec.md) | A design specification, not an executable product. |
| Testing | [Playwright Test Agents](playwright-test-agents.md) | Agent definitions that need a surrounding agent environment. |
| Creative work | [FireRed-OpenStoryline](firered-openstoryline.md) | An application with setup and external-service boundaries. |
| Browser tasks | [Browser Use](browser-use.md) | Distinct hosted, embedded, and capability-adapter surfaces. |
| Desktop tasks | [Computer Use](computer-use.md) | Tool interfaces and execution environments, not one interchangeable product. |
| Voice | [Realtime Voice](realtime-voice.md) | Hosted session and application-hosted runtime approaches. |
| Background work | [Background Execution](background-execution.md) | Asynchronous execution, with its own limits and cancellation behavior. |
| Evaluation | [Agent Evaluation](agent-evaluation.md) | The evaluation environment as well as the agent under test. |

[Operating arrangements](operating-arrangements.md) offers further examples of how
these systems can work independently or together. These are options, not maturity levels.

## Read the scope before comparing

An application, model, tool interface, framework, runtime, and agent harness may
all be useful, but they do different jobs. A subject's name is not enough to tell
whether it runs on its own, needs integration, or calls an external service.

The machine-readable [index](index.json) records the reviewed subject kind,
workloads, operating characteristics, exact scope, date, and supporting sources.
A structural relationship is not proof of tested interoperability.

## How entries are reviewed

An entry should explain native terminology, execution placement, retained state,
tool/effect boundaries, permissions, completion, interruption, recovery, and
limitations where those questions matter. It should distinguish documentation,
source inspection, inference, and executed testing.

Inclusion should teach something material about how agent work is carried out,
not simply add another product that contains an LLM. Mapping every system into a
shared architecture is not a goal.

A system entry explains a tool. A structured comparison records a scoped capability
observation. A benchmark reports measured behavior over specified trials. These
are different kinds of evidence; an entry need not have a benchmark result.

The index and schema are publication/build data, not a protocol, required
implementation schema, or conformance format. Use [TEMPLATE.md](TEMPLATE.md) to
contribute an entry and [the comparison methodology](../comparisons/methodology.md)
to understand the evidence states.
