# Anthropic Claude Code CLI


## Scope

- **System:** Anthropic Claude Code
- **Role:** Harness
- **Interface/surface:** Claude Code CLI, including native settings/hooks and the CLI `--print` automation surface
- **Version:** 2.1.282
- **Release date:** September 24, 2026
- **Deployment mode:** local CLI process
- **Reviewed at:** September 25, 2026
- **Evidence status:** first-party documentation and release notes; live Harness Operations tests pending

Claude Agent SDK, Claude Desktop, hosted/cloud sessions, remote-control-specific behavior, IDE-specific behavior, and the redesigned Claude Projects beta are distinct surfaces and are not silently folded into this row. See [Claude Projects (beta)](claude-projects.md) for the coordinator/thread orchestration surface.

## Primary sources

- https://github.com/anthropics/claude-code/releases/tag/v2.1.282
- https://code.claude.com/docs/en/cli-reference
- https://code.claude.com/docs/en/permissions
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/features-overview
- https://code.claude.com/docs/en/env-vars
- https://code.claude.com/docs/en/commands
- https://code.claude.com/docs/en/security
- https://code.claude.com/docs/en/monitoring-usage

## Native operational concepts

| Native concept | Native meaning | Harness Operations relationship | Notes |
| --- | --- | --- | --- |
| Session | Claude Code conversation/execution context with a session ID and persisted transcript | Agent Session; may participate in a broader Run | Preserve native session identity and resume semantics. |
| Tool request | Proposed Bash/file/MCP/etc. action | Capability use inside an Agent Session | Permission evaluation can gate the call before execution. |
| Permission rule/mode | Declarative allow/deny/ask behavior for tool use | Policy + execution control | Not identical to organizational Authority. |
| PreToolUse hook | External hook invoked before matching tool use and able to block/modify decisions | Enforcement/control point | Stronger than prompt-only instructions. |
| Subagent | Isolated worker with its own context that reports to the main agent | Delegated Agent Session/work unit | Native Claude Code semantics remain authoritative. |
| Agent team | Experimental independent Claude Code teammates with shared tasks/message exchange | Multi-session coordination | Experimental and disabled by default. |
| Sandbox | Optional OS-level sandbox mode on supported platforms | Execution Environment / enforcement mechanism | Distinct from permission prompts. |
| Transcript / OTel | Persisted session history and optional telemetry export | Evidence inputs | Retention/redaction configuration matters. |

## Lifecycle

Claude Code exposes stable session identifiers and resume/continue behavior. The CLI supports interactive sessions and a non-interactive `--print` mode for scripting/automation.

The current release also has explicit current-turn interruption behavior. Interruption is not rollback: already completed tool or external side effects may remain.

## Coordination

Claude Code supports native subagents for isolated delegated work. Agent teams provide a broader multi-session coordination model with peer-to-peer communication and shared task coordination, but Anthropic documents them as experimental and disabled by default.

This reference entry treats native subagent delegation as available without claiming A2A or cross-vendor handoff compatibility.

## Governance and enforcement

Claude Code's permission evaluation includes hooks, deny rules, permission modes, allow rules, and interactive/runtime decisions. PreToolUse hooks and deny rules can prevent matching tool execution before the side effect.

This distinction matters operationally: CLAUDE.md or a skill saying “do not do X” is model guidance, while a blocking PreToolUse hook or permission rule is an execution control.

The scoped public docs do not establish durable named-human Principal attribution for every approval decision, so attributed decision remains partial.

## Isolation and credentials

Claude Code documents optional OS-level sandboxing for shell execution on supported platforms. Permission modes and sandboxing are distinct controls.

Credential mediation remains unknown under the comparison definition's strong definition. Claude Code supports several authentication/credential configuration paths, but Anthropic also warns that a tool reading a credential file or printing a secret can cause that value to appear in session history. That is not sufficient evidence to claim credentials are consistently brokered away from model/tool context.

## Resources

Claude Code documents usage/monitoring surfaces and OpenTelemetry export. It also documents hard configurable bounds such as maximum tool/subagent concurrency and output-token limits.

Those are genuine enforced limits, but they do not amount to a universal monetary or all-resource budget system.

## Evidence

Claude Code persists session transcripts unless configured otherwise and exports session IDs to hooks/subprocesses. Optional OpenTelemetry can emit metrics/logging, and recent releases can emit managed-settings resolution evidence.

This is useful operational evidence but not enough to claim a complete Harness Operations Audit Record for all policy, identity, credential, environment, and external side-effect facts. Resolved execution facts are therefore partial.

## Capability summary

Documentation-backed available findings:

- interactive CLI operation;
- machine-oriented `--print` automation;
- stable session identity;
- resume;
- interruption;
- native parallel work through subagents;
- native delegation to subagents;
- configured pre-execution permission/hook gate;
- optional sandbox isolation;
- usage/telemetry reporting;
- configured resource limits;
- session/telemetry event evidence.

Partial:

- attributed decision;
- resolved execution facts.

Unknown:

- credential mediation under the stronger comparison definition.

## Further validation

Useful live tests include:

1. start session and capture session ID;
2. resume the same session and verify continuity;
3. run non-interactive `--print` with structured output;
4. configure a PreToolUse hook that denies a disposable write/command and verify the side effect does not occur;
5. exercise sandbox behavior on a disposable path;
6. spawn a subagent and capture delegation/result behavior;
7. enable a safe OTel test collector or inspect a redacted local transcript and compare documented evidence fields.

Live-test evidence must be added separately from documentation evidence.

## Limitations

This reference entry is descriptive, not certification or endorsement. Current documentation can be superseded by later Claude Code releases. A successful live test proves only the tested version/interface/configuration and operation.
