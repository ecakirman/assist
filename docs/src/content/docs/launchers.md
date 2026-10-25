---
id: launchers
title: Launchers
group: CLI
order: 1
covers:
  - cli:draft
  - cli:bug
  - cli:refine
  - cli:review-pr-comments
  - cli:fix-conflict
  - cli:signal next
  - cli:signal done
---

The dashboard starts each agent mode by running one of these launchers inside a session. Run from a terminal, they start the agent right there in the terminal instead; it isn't a session, so it has no card on the dashboard.

## Commands

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
