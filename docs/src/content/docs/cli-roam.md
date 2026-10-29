---
id: cli-roam
title: assist roam
group: CLI
order: 31
covers:
  - cli:roam show-claude-code-icon
  - cli:roam stop-claude-code-icon
  - cli:roam show-codex-icon
  - cli:roam stop-codex-icon
---

## Agent icons

These commands show and clear the Claude Code or Codex icon in the Roam desktop app while an agent works. Add them to your harness's hooks yourself: the `show` command to a hook that fires on each tool call, and the `stop` command to the hook that fires when the agent stops.

- `assist roam show-claude-code-icon` and `assist roam stop-claude-code-icon` show and clear the Claude Code icon.
- `assist roam show-codex-icon` and `assist roam stop-codex-icon` show and clear the Codex icon.
