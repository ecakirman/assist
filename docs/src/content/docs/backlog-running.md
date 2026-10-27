---
id: backlog-running
title: Running items
group: Backlog
order: 2
covers:
  - claude:next
---

**Build** on an [item](../backlog/) runs its plan. Each phase gets a fresh agent session, nested under the item's card in the sidebar, which works through the phase's tasks, verifies its work and moves on to the next phase. An interrupted run picks up from the phase it was on.

## Steering a run

- **Continue** on the session's top bar decides whether the next phase starts on its own. Turn it off to stop after the current phase, then **Build** again when you're ready.
- When a phase has manual checks, the agent asks you to confirm them. Reply in its terminal.
- To send the item back to an earlier phase, **Rewind** that phase on the item's [plan](../backlog/#plan).

## The review phase

After the last phase, a review session checks the work against each acceptance criterion and fixes what fails. Tell it the item is done once you're happy, or use **Done** on the session's top bar; the item is then marked done. **Dismiss** on the top bar closes the session once it finishes.

## Chaining into the next item

`/next [id]` in a session ends it and starts the next item: `<id>` when given, otherwise the item already in progress, or one you pick from the repo's open items.
