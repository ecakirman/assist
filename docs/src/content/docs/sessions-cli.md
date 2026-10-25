---
id: sessions-cli
title: Sessions from the CLI
group: Sessions
order: 7
covers:
  - cli:draft
  - cli:bug
  - cli:refine
  - cli:review-pr-comments
  - cli:fix-conflict
  - cli:signal next
  - cli:signal done
  - cli:sessions close
  - cli:sessions rename
  - cli:sessions output
  - cli:sessions set-status
  - cli:sessions summarise
  - claude:close
  - claude:rename
  - claude:run-logs
---

The dashboard is the main way to run sessions. The commands below are what it, and the agents inside it, call underneath; you can also run them yourself from a terminal in the repo.

## Launching sessions

Each of these starts an agent in the current terminal, in the same mode the dashboard would:

- `assist draft [description]` (alias `feat`) starts Claude in `/draft` mode.
- `assist bug [description]` starts Claude in `/bug` mode.
- `assist refine [id]` starts a harness in `/refine` mode to refine a backlog item. `--harness <claude|codex|pi>` overrides `harness.engine`.
- `assist review-pr-comments [number]` starts Claude working through a pull request's review comments one by one, checking out PR `<number>` first when given. `--announce` posts the PR to Slack once every thread is handled.
- `assist fix-conflict [number]` starts Claude resolving a pull request's merge conflicts against the remote default branch. `--rebase` rebases instead of merging.

Each takes `--resume-session <id>` to resume an interrupted Claude session, which is what the daemon uses after a restart.

## Chaining into the next item

A launched session ends by writing a signal that tells its launcher what to do next. Agents write these themselves at the end of the matching slash command; you rarely run them by hand.

- `assist signal done [id]` marks the session's task complete. `/draft` and `/bug` pass the id of the item they created, which then shows on the card.
- `assist signal next [id]` (what `/next` runs) chains into the next backlog item: item `<id>` when given, otherwise whatever `assist next` picks.

`draft`, `bug` and `refine` follow a `next` signal into the next item. `--once` makes the launcher exit when its initial task completes.

## From inside a session

Every session's process gets `ASSIST_SESSION_ID` in its environment, so commands run inside it, by you or the agent, can act on their own card:

- `assist sessions rename <title>` retitles the card. It beats both the generated title and the backlog item's name for the rest of the session's life. Inside Claude, `/rename [title]` does it, inferring a title from the conversation when you give none.
- `assist sessions close` ends the session and reaps its worktree, subject to the unpushed-work rule. `/close` asks the agent to judge whether its work is finished and, only if so, run it.
- `assist sessions output [session-id]` prints the recent output of a session on this machine with colour codes stripped (`-n <count>` lines, default 200). `--server [group]` reads the current repo's live dev server instead. `/run-logs [session-id|group]` has the agent read a run's output and summarise its errors, warnings and state.
- `assist sessions set-status <status>` reports `running` or `waiting` to the daemon. assist's Claude hooks call it to drive the card's status; you don't run it yourself.

## Transcript summaries

`assist sessions summarise` asks Claude for a one-line summary of each Claude transcript under `~/.claude/projects` that doesn't have one yet, and saves it next to the transcript as a `.summary` file. `--force` regenerates existing summaries and `-n <count>` limits how many it does in one run.
