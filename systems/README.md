# Systems

Systems is the canonical concrete reference for Harnesses and adjacent components relevant to Harness Operations.

Each entry describes a concrete subject in its native terms before applying shared abstractions, so readers can see how agent work is actually structured, operated, constrained, and combined across different workloads.

## Reference entries

The reference set deliberately mixes different subject kinds so the reference does not collapse models, Harnesses, applications, role definitions, and domain specifications into one product category.

Coverage is selective rather than a claim of complete market coverage. Subjects are included because they clarify materially different operational shapes, not because of popularity or endorsement.

| Area | Subject | Kind | Why it is here |
| --- | --- | --- | --- |
| Coding | [Codex App Server](openai-codex.md) | Harness interface | Reviewed coding Harness surface with a machine-control interface. |
| Coding | [Claude Code CLI](anthropic-claude-code.md) | Harness interface | Reviewed coding Harness surface with interactive and delegated work. |
| Orchestration | [Claude Projects (beta)](claude-projects.md) | Application + control layer | A coordinator scopes and routes work across parallel Claude Code threads that can run in the cloud or on a user's machine via Remote Control. |
| Security | [Antares models](antares-models.md) | Model | Specialization lives in model weights and a constrained terminal-action format. |
| Security | [Antares CLI](antares-cli.md) | Harness | Packages the Antares agent loop around a read-only repository snapshot and configurable inference endpoint. |
| Security | [Cisco Foundry Security Spec](cisco-foundry-security-spec.md) | Domain specification | A deliberately prescriptive architecture seed for a bounded security-evaluation workload, not executable code. |
| Testing | [Playwright Test Agents](playwright-test-agents.md) | Agent definitions | Planner/generator/healer specializations generated into existing agent environments such as Claude Code and Codex. |
| Creative video | [FireRed-OpenStoryline](firered-openstoryline.md) | Agentic application | Conversational video workflow with its own application plus documented Agent Skills integration paths. |
| Browser automation | [Browser Use](browser-use.md) | Harnesses and capability adapter | One project family exposes a hosted agent, embeddable local agent, and a separate browser capability for existing agents. |
| Desktop automation | [Computer Use](computer-use.md) | Tool interfaces and capability runtime | OpenAI/Anthropic expose client-executed computer-control interfaces, while macOS Harness supplies OS primitives to an outer coding Harness. |
| Realtime voice | [Realtime Voice](realtime-voice.md) | Hosted session runtime + open framework | Continuous streaming, interruption, turn-taking, transport, and live tool execution become first-class. |
| Long-running execution | [Background Execution](background-execution.md) | Hosted execution runtime | Work outlives the initiating connection and must be polled, resumed, cancelled, and retained deliberately. |
| Agent evaluation | [Inspect AI](agent-evaluation.md) | Evaluation framework/runtime | The evaluator operates the agent as a system under test, with its own sandbox, limits, recovery, scoring, and evidence. |

See [Operating arrangements](operating-arrangements.md) for the cross-system view.

The machine-readable systems index is [index.json](index.json). It records subject kind, workloads and operational characteristics, reviewed scope, and source-backed relationships without turning those relationships into interoperability claims.

## Reader walkthrough

A new reader should be able to use Systems without learning the Reference Model first:

1. **Identify an area** in the reference table, such as security, testing, creative work, or browser automation.
2. **Open one reference entry** and find where its actual agent loop, state, tools, execution, and completion boundary live.
3. **Follow an operating arrangement or relationship** to see how work can be embedded, delegated, or handed off without assuming shared lifecycles.
4. **Check the evidence and unknowns** before treating a documented relationship as tested compatibility or a model benchmark as an operational guarantee.

For deeper implementation concepts, readers can then move to the Reference Model, requirements work, or benchmark work as appropriate.

## Inclusion rule

Include a subject when it demonstrates or materially clarifies at least one of:

- a distinct agent execution loop;
- a specialization mechanism;
- an operational or trust boundary;
- a meaningful state or lifecycle model;
- an independent or cooperative operating arrangement;
- a consequential tool/effect boundary;
- an evidence or verification model;
- a failure, recovery, cancellation, or intervention behavior.

Do not include a subject merely because it uses an LLM.

## Subjects are not all Harnesses

A reference entry may carry one or more subject kinds when a single label would erase a material role. The systems index still expects an intentionally small set of kinds rather than a feature taxonomy.

An `operating_arrangements` association means the subject materially participates in or explicitly describes that arrangement. For a model, agent definition, or architecture specification, it does **not** imply that the subject itself is an executable runtime.

The entry should explain why that subject belongs and avoid promoting implementation-specific objects into universal Harness Operations concepts.

## Native terms first

A reference entry should first answer:

- What does the system call its own units of work, sessions, roles, tools, artifacts, or findings?
- Where does the agent loop run?
- What state persists and where?
- What can the system affect?
- Which component actually enforces relevant constraints?
- What does completion mean for this workload?
- What happens on interruption, partial completion, or ambiguous effects?
- How can the system operate independently or relate to other systems?
- Which claims are documented, source-inspected, tested, inferred, or unknown?

Mapping to Harness Operations concepts is optional and secondary.

## Entries, comparisons, assessments, and benchmarks

- A **System reference entry** explains a concrete design and its operational boundaries.
- A **structured comparison observation** records whether a scoped interface provides a defined capability and with what evidence.
- A **requirements assessment** evaluates a separately defined profile or requirement set.
- A **benchmark result** reports observed behavior over executable scenarios and repeated trials.

A reference entry can exist without an assessment or benchmark result.

## Evidence boundary

Reference entries are documentation- and source-backed unless an entry explicitly says otherwise. Reviewing a repository, paper, model card, or product documentation is **not** a live product or interoperability test.

The systems index records structural relationships only when both endpoints are established at the scope represented by their Systems subjects. Broader product-family relationships may still be documented in prose, but they are not promoted into machine edges until the endpoint scope is sufficiently specific. Demonstrated interoperability belongs in the separate comparison integration dataset with source/target interface, operation, configuration, and test evidence.

## Data-format boundary

`index.json` and `schema.json` are publication/build data for this canonical reference. They are **not** a Harness Operations wire protocol, required implementation schema, conformance format, or product API.

Use [TEMPLATE.md](TEMPLATE.md) for new reference entries.
