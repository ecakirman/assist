---
id: sessions-creating
title: Creating sessions
group: Sessions
order: 2
covers:
  - config:sessions.newSessionMode
  - cli:draft
  - cli:bug
  - cli:refine
  - cli:review-pr-comments
  - cli:fix-conflict
  - cli:signal next
  - cli:signal done
screenshots:
  - file: sessions-new.png
    alt: The new-session dialog in draft mode
    route: /sessions
    scene: dashboard
    waitFor: text=Pricing page copy
    actions:
      - click: text=Dark mode toggle
      - click: "[aria-label='New session']"
  - file: sessions-run.png
    alt: A dev server running as a session
    route: /sessions
    scene: dashboard
    waitFor: text=Pricing page copy
    actions:
      - click: "text=run: dev"
---

## The new-session dialog

The **+** button in the toolbar, **Mod+N** or **Alt+N** opens the new-session dialog. Type what you want, pick the repo and a mode, and press **Enter** (**Shift+Enter** adds a newline, **Esc** closes).

::screenshot{file="sessions-new.png"}

| Mode   | Starts                                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| draft  | `assist draft --once <text>`: Claude drafts a backlog item from your description, asking questions as it goes                  |
| bug    | `assist bug --once <text>`: Claude files a bug with reproduction steps, expected and actual behaviour                          |
| prompt | A plain agent session with your text as its first prompt. When Codex or pi is available, a menu on this mode picks the harness |
| design | An interactive Claude session with assist's design system prompt appended                                                      |

Draft and bug need a repo. When the repo isn't cloned on the machine you picked, the button offers to clone it first.

The dialog opens in `draft` mode. To open it in another mode:

```bash
assist config set sessions.newSessionMode prompt -g
```

## Run sessions

A repo's `run` entries in `assist.yml` can run as sessions too, so a dev server's output sits next to the agents using it. When the repo has run entries, the toolbar's run menu starts them.

An entry flagged `server:` is a dev server, and only one may be live per server group across a repo's clone and worktrees. Cards in that repo show a start button, the serving card shows `serving :<port>` and a stop button, and starting a second one offers to replace the first. Agents can read a run's output with `/run-logs` (see [The session area](../sessions-session-area/)).

::screenshot{file="sessions-run.png"}

## Launching from a terminal

The same assist commands can be launched from any terminal in the repo:

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

`draft`, `bug` and `refine` follow a `next` signal into the next item. `--once`, which the dialog passes, makes the launcher exit when its initial task completes.
