# Credential-free interface smoke tests

**Reviewed:** September 25, 2026

These tests provide narrow live evidence for exact, publicly installable Harness interfaces without requiring account credentials or model calls.

They intentionally prove only what they execute.

## Codex App Server 0.157.0

Command surface:

```bash
npx -y @openai/codex@0.157.0 --version
npx -y @openai/codex@0.157.0 app-server --help
```

Assertions:

- the installed binary reports version 0.157.0;
- the installed CLI exposes the App Server command/help surface.

This supports the matrix's machine-control-surface observation. It does **not** live-test thread creation, resume, interruption, approvals, sandbox enforcement, usage, or event persistence because those require a configured/authenticated runtime.

## Claude Code CLI 2.1.282

Command surface:

```bash
npx -y @anthropic-ai/claude-code@2.1.282 --version
npx -y @anthropic-ai/claude-code@2.1.282 --help
```

Assertions:

- the installed binary reports version 2.1.282;
- the installed CLI exposes non-interactive `--print` / structured-output automation options.

This supports the matrix's machine-control-surface observation. It does **not** live-test session resume, hooks, sandbox enforcement, subagent delegation, telemetry, or tool execution because those require a configured/authenticated runtime.

## Evidence boundary

A passing interface smoke test is not a passing interoperability, security, approval, or lifecycle test.

The comparison dataset keeps these live-test results alongside—not instead of—the first-party documentation used for broader findings.
