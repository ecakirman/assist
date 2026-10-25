---
id: sessions-cli
title: Session commands
group: Sessions
order: 7
covers:
  - cli:sessions close
  - cli:sessions rename
  - cli:sessions output
  - cli:sessions set-status
  - cli:sessions summarise
  - claude:close
  - claude:rename
  - claude:run-logs
---

Sessions are started from the dashboard, which runs a [launcher](../launchers/) inside each one. These are the commands that act on sessions once they're running.

## From inside a session

Ask the agent in a session to act on its own card with these slash commands:

- `/rename [title]` retitles the card, inferring a title from the conversation when you give none. The new title beats both the generated title and the backlog item's name for the rest of the session's life.
- `/close` has the agent judge whether its work is finished and, only if so, end the session and reap its worktree, subject to the unpushed-work rule.
- `/run-logs [session-id|group]` has the agent read a run's output, such as the repo's dev server, and summarise its errors, warnings and state.

Underneath, they run `assist sessions rename <title>`, `assist sessions close` and `assist sessions output [session-id]`, which find their card through the `ASSIST_SESSION_ID` every session's process gets. `sessions output` prints a session's recent output with colour codes stripped (`-n <count>` lines, default 200), or the current repo's live dev server with `--server [group]`. assist's Claude hooks also call `assist sessions set-status <running|waiting>` to drive the card's status.

## Transcript summaries

`assist sessions summarise` asks Claude for a one-line summary of each Claude transcript under `~/.claude/projects` that doesn't have one yet, and saves it next to the transcript as a `.summary` file. `--force` regenerates existing summaries and `-n <count>` limits how many it does in one run.
