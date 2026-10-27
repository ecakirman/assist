---
id: cli-backlog
title: assist backlog
group: CLI
order: 8
covers:
  - cli:backlog
  - cli:backlog web
  - cli:list
  - cli:backlog list
  - cli:backlog search
  - cli:backlog show
  - cli:backlog plan
  - cli:backlog comments
  - cli:backlog add
  - cli:backlog update-field
  - cli:backlog add-phase
  - cli:backlog update-phase
  - cli:backlog remove-phase
  - cli:backlog move-phase
  - cli:backlog update-plan
  - cli:backlog start
  - cli:backlog stop
  - cli:backlog done
  - cli:backlog wontdo
  - cli:backlog set-status
  - cli:backlog star
  - cli:backlog unstar
  - cli:backlog delete
  - cli:backlog comment
  - cli:backlog delete-comment
  - cli:backlog link
  - cli:backlog unlink
  - cli:backlog associate-jira
  - cli:backlog associate-github
  - cli:backlog add-activity
  - cli:backlog record-slack
  - cli:backlog record-session
  - cli:backlog run
  - cli:backlog next
  - cli:next
  - cli:backlog refine
  - cli:backlog phase-done
  - cli:backlog rewind
  - cli:backlog clone
  - cli:backlog move-repo
  - cli:backlog export
  - cli:backlog import
---

These work on the current repo's [backlog](../backlog/). Item ids are written `a555`; commands also accept `555`.

## Viewing

- `assist backlog` (or `assist backlog web`) opens the Backlog tab in the dashboard. `--port <number>` picks the port (default 3100) and `--no-open` skips opening a browser.
- `assist backlog list` (alias `ls`, also `assist list`) lists open items. `--status <status>` filters by status, `--all` includes done and won't-do items, `--all-repos` lists every repo's items and `--verbose` shows each item in full.
- `assist backlog search <query>` finds items by keyword.
- `assist backlog show <id>` (alias `view`) prints an item in full. `--all-commits` lists every commit in its activity rather than the newest 10.
- `assist backlog plan <id>` prints just its plan, and `assist backlog comments <id>` just its comments.

## Writing

- `assist backlog add` adds an item, prompting for anything not given by `--name`, `--type <story|bug>`, `--desc` and `--ac <criterion>` (repeatable).
- `assist backlog update-field <id>` :badge[internal] changes `--name`, `--desc` or `--type`. `--ac` replaces every acceptance criterion, while `--add-ac <text>`, `--edit-ac <n> <text>` and `--remove-ac <n>` change one. `--origin [origin]` moves the item to another repo, the current one when no origin is given. Called by `/refine`.
- `assist backlog add-phase <id> <name> --task <task>` adds a phase, with `--manual-check <check>` (both repeatable) and `--position <n>` to insert it rather than append it.
- `assist backlog update-phase <id> <phase>` (alias `edit-phase`) changes a phase's `--name`, replaces its `--task` or `--manual-check` lists, or changes one with `--add-task`, `--edit-task <n>`, `--remove-task <n>`, `--add-check`, `--edit-check <n>` and `--remove-check <n>`.
- `assist backlog remove-phase <id> <phase>` removes a phase, and `assist backlog move-phase <id> <from> <to>` moves one.
- `assist backlog update-plan <id> --json <file|->` :badge[internal] replaces the whole plan from a JSON payload, after approval in a dashboard session. Called by `/refine`.

## Status

- `assist backlog start <id>` sets an item in progress, and `assist backlog stop` puts every in-progress item back to todo at its first phase.
- `assist backlog done <id> [summary]` :badge[internal] marks an item done. Called by the review phase of a backlog run.
- `assist backlog wontdo <id> [reason]` marks an item won't do.
- `assist backlog set-status <id> <todo|in-progress|done|wontdo>` sets any status.
- `assist backlog star <id>` and `assist backlog unstar <id>` star and unstar an item.
- `assist backlog delete <id>` (alias `remove`) deletes an item.

## Comments, links and activity

- `assist backlog comment <id> <text>` :badge[internal] adds a comment. Called by backlog run phases and `/refine`.
- `assist backlog delete-comment <id> <comment-id>` deletes a comment. Phase summaries can't be deleted.
- `assist backlog link <from> <to>` links two items, `--type depends-on` making `<from>` wait for `<to>` (default `relates-to`). `assist backlog unlink <from> <to>` removes the link.
- `assist backlog associate-jira <id> [key]` links a Jira issue by key or browse URL, and `assist backlog associate-github <id> [issue]` a GitHub issue by URL or `owner/repo#number`. An item has one or the other, and `--clear` removes it.
- `assist backlog record-session <id>` :badge[internal] attaches the agent conversation it runs inside to an item, or `--session <id>` attaches another. Called by an agent asked to attach its conversation to an item.
- `assist backlog add-activity <id> <branch|commit|pr|slack|session> <ref>` :badge[internal] attaches a ref to an item's activity, with `--title`, `--url` and `--state`. Called by `/draft` and `/bug`.
- `assist backlog record-slack <url>` :badge[internal] attaches a Slack thread to the current session's item. Called by `/prs-slack`.

## Running

- `assist backlog run <id>` runs an item's plan in this terminal, from the phase it is on. `--harness <claude|codex|pi>` overrides `harness.engine`, and `--no-write` runs the harness without write access.
- `assist next [id]` (or `assist backlog next`) runs the item already in progress, or one you pick, then offers the next. With `[id]` it runs that item first; with no items left it starts `/draft`. `--once` stops after one item.
- `assist backlog refine [id]` is the same as [`assist refine`](../launchers/).
- `assist backlog rewind <id> <phase> --reason <reason>` sends an item back to an earlier phase.
- `assist backlog phase-done <id> <phase> <summary>` :badge[internal] marks a phase complete and records its summary. Called by the agent running each phase of a backlog run.

## Repos and data

- `assist backlog clone <origin>` clones an item's repo over SSH into `clone.baseDir`.
- `assist backlog move-repo <old-origin> [new-origin]` moves every item from one repo to another after a rename, the current repo when no new origin is given. `--yes` skips the prompt.
- `assist backlog export [file]` writes the whole backlog database to a file, or stdout, and `assist backlog import [file]` replaces the database with an export, from stdin when no file is given. `--yes` skips the prompt.
