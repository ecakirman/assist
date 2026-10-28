---
id: sessions-sidebar
title: Sidebar and cards
group: Sessions
order: 1
covers:
  - config:sessions.floatWaiting
  - config:sessions.floatWaitingAfterMs
  - config:sessions.parkWaitingAfterMs
screenshots:
  - file: sessions-sidebar.png
    alt: Sidebar cards in the waiting, running and done states
    route: /sessions
    scene: dashboard
    waitFor: text=Pricing page copy
    viewport:
      width: 1280
      height: 480
    crop: "[data-testid=sidebar]"
  - file: sessions-history.png
    alt: The History tab listing past sessions in the selected repo
    route: /sessions
    scene: history
    waitFor: text=History 4
    actions:
      - click: text=History 4
    viewport:
      width: 1280
      height: 560
    crop: "[data-testid=sidebar]"
---

## Session cards

Each card shows a status glyph, the session's title and a line of details.

::screenshot{file="sessions-sidebar.png"}

| Glyph              | Status                                                                           |
| ------------------ | -------------------------------------------------------------------------------- |
| :status[running]   | Running: the agent is working, or the run is live                                |
| :status[verifying] | Running [`assist verify`](../verify/)                                            |
| :status[waiting]   | Waiting on you: an answer, a permission prompt or a preview to approve           |
| :status[done]      | Done                                                                             |
| :status[error]     | Exited with an error                                                             |
| :status[stopped]   | Stopped, holding unpushed work (see [Parallel work](../sessions-parallel-work/)) |

The detail line shows the repo, then the session type or, for a backlog run, the phase it is on, followed by any pull request, backlog item and issue it is linked to, and any badges:

| Badge           | Shown when                                                      |
| --------------- | --------------------------------------------------------------- |
| :badge[clone]   | The session runs in the repo's own clone rather than a worktree |
| :badge[harness] | The session runs a harness other than Claude                    |
| :badge[serving] | The session is a dev server, linking to its port                |
| :badge[node]    | The session runs on a linked machine                            |

## Grouping and order

Cards are grouped by repo. A repo with one session shows a lone card; two or more get a group header with a count, which collapses the group, and an × on hover that closes every session in it. Sessions a backlog run launches nest under that run's card.

Starred sessions come first. Then come sessions that have been waiting on you longest, so whatever needs you floats to the top. Everything else keeps its order. :kbd[Mod+.] jumps straight to the next waiting session.

A session floats once it has waited 5 seconds. To change the delay, or stop floating altogether:

```bash
assist config set sessions.floatWaitingAfterMs 15000
assist config set sessions.floatWaiting false
```

A repo group where every session has waited on you for 5 minutes collapses and parks below a **Parked** divider at the bottom of the list, unless it holds a starred session or the one you're viewing. Click a parked group to open it and bring it back up. A group you collapse yourself stays where it is, marked with a pin, until you open it. To change the delay:

```bash
assist config set sessions.parkWaitingAfterMs 600000
```

The button at the left of the tab row hides the sidebar; the same button then appears in the toolbar to bring it back.

## Closing a session

The × on a card ends the session. A finished session is dismissed straight away; anything still live asks first, because closing kills its process. A card with nested sessions offers to close just itself or all of them. An agent can also close its own session: [`/close`](../sessions-cli/#slash-commands) has it check its work is finished first.

When the session holds unpushed work, closing stops it instead of removing it. The card stays, greyed, with **Restart** and a discard button that either throws the changes away or just drops the card, leaving the files on disk.

## History

The **History** tab lists past sessions in the selected repo. The search box searches their transcripts and shows a snippet of each match.

::screenshot{file="sessions-history.png"}
Clicking an entry shows its transcript, and **Resume** starts it again as a live session.
