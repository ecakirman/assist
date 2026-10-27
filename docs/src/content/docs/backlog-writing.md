---
id: backlog-writing
title: Writing items
group: Backlog
order: 1
covers:
  - claude:draft
  - claude:bug
  - claude:refine
  - claude:subtask
  - config:subtasks
---

Items are written with an agent rather than typed in: briefly describe what you want, answer its questions, and approve the item it proposes.

## Drafting a story

Start a **draft** session from the [new-session dialog](../sessions-creating/), or run `/draft [description]` in any session. The agent reads the code around your idea, asks a few questions one at a time, then proposes the item in the [preview pane](../sessions-preview-panes/#proposing-a-backlog-item): a name, a description, acceptance criteria and a plan.

A plan is a list of phases (context windows), each a working slice of the feature with its own tasks. A phase can also list manual checks, things only you can confirm, such as how something looks; the agent running that phase asks you to confirm them before it finishes. Don't plan a final phase to check the work: every plan automatically ends with a [review phase](../backlog-running/#the-review-phase) that checks the item against its acceptance criteria.

Mention a Jira key, a GitHub issue or a Slack thread while drafting, and the item is linked to it.

## Filing a bug

Start a **bug** session, or run `/bug [description]`. The agent asks for the steps to reproduce it, what should happen and what happens instead, and proposes a bug with those and its acceptance criteria. A bug has no plan: the agent that fixes it works out how.

## Refining an item

**Refine** on an item, or `/refine <id>` in a session, starts a conversation about the item. Tell the agent what to change: its name, description, type, acceptance criteria, plan or linked issue, or feedback to keep as a comment. A change to the plan opens in the preview pane as a diff of its phases for you to approve.

## Sub-tasks

Sub-tasks are loose ends that sit outside the plan, such as a follow-up the item can't be finished without. In a session working on an item, `/subtask <text>` adds one to it. An item can't be marked done until its sub-tasks are.

To add the same sub-tasks to every new item:

```bash
assist config set subtasks.0.title "Update the changelog"
```

Each entry takes a `title` and an optional `description`.
