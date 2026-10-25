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

Every session's process gets `ASSIST_SESSION_ID` in its environment, so commands run inside it, by you or the agent, can act on their own card:

- `assist sessions rename <title>` retitles the card. It beats both the generated title and the backlog item's name for the rest of the session's life. Inside Claude, `/rename [title]` does it, inferring a title from the conversation when you give none.
- `assist sessions close` ends the session and reaps its worktree, subject to the unpushed-work rule. `/close` asks the agent to judge whether its work is finished and, only if so, run it.
- `assist sessions output [session-id]` prints the recent output of a session on this machine with colour codes stripped (`-n <count>` lines, default 200). `--server [group]` reads the current repo's live dev server instead. `/run-logs [session-id|group]` has the agent read a run's output and summarise its errors, warnings and state.
- `assist sessions set-status <status>` reports `running` or `waiting` to the daemon. assist's Claude hooks call it to drive the card's status; you don't run it yourself.

## Transcript summaries

`assist sessions summarise` asks Claude for a one-line summary of each Claude transcript under `~/.claude/projects` that doesn't have one yet, and saves it next to the transcript as a `.summary` file. `--force` regenerates existing summaries and `-n <count>` limits how many it does in one run.
