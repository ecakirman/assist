---
id: sessions-sidebar
title: Sidebar and cards
group: Sessions
order: 1
covers:
  - config:sessions.floatWaiting
  - config:sessions.floatWaitingAfterMs
  - cli:sessions summarise
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
---

## Session cards

Each card shows a status glyph, the session's title and a line of details.

::screenshot{file="sessions-sidebar.png"}

| Glyph            | Status                                                                           |
| ---------------- | -------------------------------------------------------------------------------- |
| Green ●          | Running: the agent is working, or the run is live                                |
| Ringed green ●   | Running `assist verify`                                                          |
| Amber ◆, pulsing | Waiting on you: an answer, a permission prompt or a preview to approve           |
| Blue ✓           | Done                                                                             |
| Red ✕            | Exited with an error                                                             |
| Grey ○           | Stopped, holding unpushed work (see [Parallel work](../sessions-parallel-work/)) |

A new agent session's title is generated from its prompt. The detail line shows the repo, then the session type (`prompt`, `run`, `draft`, `bug`, `refine`, `review`, `design`, `update`) or, for a backlog run, the phase it is on, followed by any pull request, backlog item and issue it is linked to. Badges add:

- a house when the session runs in the repo's own clone rather than a worktree;
- the harness, when it isn't Claude;
- `serving :<port>` on a dev server;
- the machine it runs on, when you have linked machines.

Below that, a card can show its git change counts, how much of the context window is used, and whether it was restored after a daemon restart.

## Grouping and order

Cards are grouped by repo. A repo with one session shows a lone card; two or more get a group header with a count, which collapses the group, and an × on hover that closes every session in it. Sessions a backlog run launches nest under that run's card.

Starred sessions come first. Then come sessions that have been waiting on you longest, so whatever needs you floats to the top. Everything else keeps its order. :kbd[Mod+.] jumps straight to the next waiting session.

A session floats once it has waited 5 seconds. To change the delay, or stop floating altogether:

```bash
assist config set sessions.floatWaitingAfterMs 15000 -g
assist config set sessions.floatWaiting false -g
```

The button at the left of the tab row hides the sidebar; the same button then appears in the toolbar to bring it back.

## Closing a session

The × on a card ends the session. A finished session is dismissed straight away; anything still live asks first, because closing kills its process. A card with nested sessions offers to close just itself or all of them.

When the session holds unpushed work, closing stops it instead of removing it. The card stays, greyed, with **Restart** and a discard button that either throws the changes away or just drops the card, leaving the files on disk.

## History

The **History** tab lists past sessions in the selected repo with a snippet of each conversation. The search box searches their transcripts. Clicking an entry shows its transcript, and **Resume** starts it again as a live session.

`assist sessions summarise` asks Claude for a one-line summary of each Claude transcript under `~/.claude/projects` that doesn't have one yet, and saves it next to the transcript as a `.summary` file. `--force` regenerates existing summaries and `-n <count>` limits how many it does in one run.
