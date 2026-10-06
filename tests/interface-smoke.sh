#!/usr/bin/env bash
set -euo pipefail

echo "== Codex 0.157.0 =="
codex_version="$(npx -y @openai/codex@0.157.0 --version)"
echo "$codex_version"
grep -Eq '0\.157\.0' <<<"$codex_version"

codex_help="$(npx -y @openai/codex@0.157.0 app-server --help)"
printf '%s\n' "$codex_help"
grep -Eiq 'app[- ]server|Usage' <<<"$codex_help"

echo "== Claude Code 2.1.282 =="
claude_version="$(npx -y @anthropic-ai/claude-code@2.1.282 --version)"
echo "$claude_version"
grep -Eq '2\.1\.282' <<<"$claude_version"

claude_help="$(npx -y @anthropic-ai/claude-code@2.1.282 --help)"
printf '%s\n' "$claude_help"
grep -Eq -- '--print|--output-format' <<<"$claude_help"

echo "PASS: exact-version interface smoke checks completed"
