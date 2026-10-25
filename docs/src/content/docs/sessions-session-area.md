---
id: sessions-session-area
title: The session area
group: Sessions
order: 3
covers:
  - config:sessions.topBar
  - cli:sessions close
  - cli:sessions rename
  - cli:sessions output
  - cli:sessions set-status
  - claude:close
  - claude:rename
  - claude:run-logs
screenshots:
  - file: sessions-top-bar.png
    alt: The top bar of a waiting session
    route: /sessions
    scene: dashboard
    waitFor: text=Pricing page copy
    viewport:
      width: 1280
      height: 400
    actions:
      - click: text=Dark mode toggle
---

## The top bar

Above the terminal, the top bar names the selected session: its repo, its number, the harness conversation id (click to copy) and its status. Below that are its backlog item, title and current phase.

::screenshot{file="sessions-top-bar.png"}

On the right are its git change counts (which open the diff), how long it has been running and its toggles, such as **Auto-approve** for draft, bug and refine sessions. Then its actions, shown only when they apply:

- **Add agent** (Alt+Z) starts another agent in the same working copy, with a prompt you type, so it picks up the work in progress. It is offered while the session is still working.
- **VS Code** (Alt+X) opens the session's working copy in VS Code.
- **Restart** ends the agent and resumes its conversation in a fresh process, after asking. **Retry** reruns a run session, or an assist command that couldn't be restored.
- **Star** pins the session to the top of the sidebar. For a backlog run, the star belongs to the item, so it carries over to the item's next session.
- **Done** (Alt+C), on a backlog item's session, marks the item done and ends the session after asking.
- **×** closes the session, as on its card.

Pull request, review and server buttons appear for sessions that have them.

To keep all of this on the cards instead, turn the top bar off:

```bash
assist config set sessions.topBar false -g
```

## From inside a session

Every session's process gets `ASSIST_SESSION_ID` in its environment, so commands run inside it, by you or the agent, can act on their own card:

- `assist sessions rename <title>` retitles the card. It beats both the generated title and the backlog item's name for the rest of the session's life. Inside Claude, `/rename [title]` does it, inferring a title from the conversation when you give none.
- `assist sessions close` ends the session and reaps its worktree, subject to the unpushed-work rule. `/close` asks the agent to judge whether its work is finished and, only if so, run it.
- `assist sessions output [session-id]` prints the recent output of a session on this machine with colour codes stripped (`-n <count>` lines, default 200). `--server [group]` reads the current repo's live dev server instead. `/run-logs [session-id|group]` has the agent read a run's output and summarise its errors, warnings and state.
- `assist sessions set-status <status>` reports `running` or `waiting` to the daemon. assist's Claude hooks call it to drive the card's status; you don't run it yourself.
