---
id: cli-roam
title: assist roam
group: CLI
order: 31
covers:
  - cli:roam auth
  - cli:roam show-claude-code-icon
  - cli:roam stop-claude-code-icon
  - cli:roam show-codex-icon
  - cli:roam stop-codex-icon
  - config:roam.clientId
  - config:roam.clientSecret
  - config:roam.accessToken
  - config:roam.refreshToken
  - config:roam.tokenExpiresAt
---

## Commands

- `assist roam auth` asks for your Roam OAuth app's client id and secret, then opens a browser to authorise it. Set the app's redirect URI to `http://localhost:14523/callback` first. It stores the credentials and tokens in the `roam.*` keys.

## Agent icons

These commands show and clear the Claude Code or Codex icon in the Roam desktop app while an agent works. Add them to your harness's hooks yourself: the `show` command to a hook that fires on each tool call, and the `stop` command to the hook that fires when the agent stops.

- `assist roam show-claude-code-icon` and `assist roam stop-claude-code-icon` show and clear the Claude Code icon.
- `assist roam show-codex-icon` and `assist roam stop-codex-icon` show and clear the Codex icon.
