---
id: backlog
title: Backlog
group: Backlog
order: 0
covers:
  - route:/backlog
  - config:clone.baseDir
screenshots:
  - file: backlog-list.png
    alt: The backlog list for the sandbox repo, with an in-progress story part-way through its plan
    route: /backlog
    scene: backlog
    waitFor: text=Cart total rounds to the wrong cent
    viewport:
      width: 1440
      height: 640
  - file: backlog-item.png
    alt: A backlog item's detail page, showing its description, acceptance criteria and sub-tasks
    route: /backlog
    scene: backlog
    waitFor: text=Cart total rounds to the wrong cent
    viewport:
      width: 1440
      height: 900
    actions:
      - click: text=Dark mode toggle
  - file: backlog-plan.png
    alt: An item's plan, with the first phase done and the second in progress
    route: /backlog
    scene: backlog
    waitFor: text=Cart total rounds to the wrong cent
    viewport:
      width: 1440
      height: 1400
    actions:
      - click: text=Dark mode toggle
    crop: "#item-section-plan"
---

The backlog holds each repo's work as items: stories and bugs, each with a description, acceptance criteria and, usually, a plan of phases that an agent works through one at a time. Items are written by [drafting](../backlog-writing/) and built by [running](../backlog-running/) them.

The **Backlog** tab (:kbd[Alt+2]) lists the selected repo's items.

## The list

::screenshot{file="backlog-list.png"}

- **Search backlog…** finds items by keyword.
- **All / Stories / Bugs** filters by type.
- **Todo / Done / All** filters by status. **Todo** shows items not yet finished, and the choice is remembered.
- The chips under the search box switch to another repo, each with its count of open items. A dashed chip is a repo that isn't cloned on the selected machine: click it to clone the repo into `clone.baseDir` (default `~/git`) and switch to it.

```bash
assist config set clone.baseDir ~/src
```

Each card shows the item's status (○ todo, ◔ in progress, ● done, ✕ won't do), id, type and, while in progress, the phase it is on, with a meter of its phases on the right. Click **phase N of M** to jump to the item's session.

On the right of a card:

- :icon[StarBorder] **Star** pins the item, so its sessions stay at the top of the [sidebar](../sessions-sidebar/).
- :icon[PlayArrow] **Build** [runs the item](../backlog-running/). A repo that isn't cloned shows **Clone** instead, and an item already running shows its session.
- :icon[MoreVert] **More actions** opens **Refine** ([refining an item](../backlog-writing/#refining-an-item)), **Mark done** and **Won't do**.

Click a card to open the item.

## An item

::screenshot{file="backlog-item.png"}

The header holds:

- **Build** runs the item from the phase it is on. Its arrow builds with Codex or pi instead, when they are installed.
- **Refine** starts a session to [refine the item](../backlog-writing/#refining-an-item). Its arrow refines with Codex or pi.
- **Delete** deletes the item.
- The status picker sets the item to todo, in-progress, done or won't do.
- The Jira or GitHub issue the item is linked to, which opens it.

Below are the **Description**, **Acceptance Criteria** and **Sub-tasks**, followed by the **Plan**, **Activity** and **Comments**. On a wide window, the navigator on the right jumps to each section and phase. Set a sub-task's status with the picker beside it; sub-tasks are added with [`/subtask`](../backlog-writing/#sub-tasks).

### Plan

::screenshot{file="backlog-plan.png"}

Each phase lists its tasks and any manual checks you'll be asked to confirm, its token and time usage, and the sessions that worked on it. **Rewind** on a finished phase sends the item back to it: give a reason, and the next build picks up from that phase with your reason.

### Activity and comments

**Activity** lists the item's branches, commits, pull requests, Slack threads and agent conversations. :icon[PlayArrow] on a conversation resumes it as a new session. **Comments** holds each phase's summary and the notes agents and you added; :icon[DeleteOutlined] deletes a comment.
