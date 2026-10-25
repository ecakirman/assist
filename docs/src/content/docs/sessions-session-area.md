---
id: sessions-session-area
title: The session area
group: Sessions
order: 3
covers: []
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
    crop: "[data-testid=session-top-bar]"
---

The session area, right of the sidebar, shows the selected session: the top bar, its terminal and your last message to it. The [diff](../sessions-diff/) and [preview panes](../sessions-preview-panes/) open beside the terminal.

## The top bar

Above the terminal, the top bar names the selected session: its repo, its number, the harness conversation id (click to copy) and its status. Below that are its backlog item, title and current phase.

::screenshot{file="sessions-top-bar.png"}

On the right are its git change counts (which open the [diff](../sessions-diff/)), how long it has been running and its toggles, such as **Auto-approve** for draft, bug and refine sessions. Then its actions, shown only when they apply:

- **Add agent** (:kbd[Alt+Z]) starts another agent in the same working copy, with a prompt you type, so it picks up the work in progress. It is offered while the session is still working.
- **VS Code** (:kbd[Alt+X]) opens the session's working copy in VS Code.
- **Restart** ends the agent and resumes its conversation in a fresh process, after asking. **Retry** reruns a run session, or an assist command that couldn't be restored.
- **Star** pins the session to the top of the sidebar. For a backlog run, the star belongs to the item, so it carries over to the item's next session.
- **Done** (:kbd[Alt+C]), on a backlog item's session, marks the item done and ends the session after asking.
- **×** closes the session, as on its card.

[Pull request](../pull-requests/), [review](../sessions-preview-panes/) and [server](../sessions-creating/#run-sessions) buttons appear for sessions that have them.

Commands an agent runs to act on its own card, such as `/close` and `/rename`, are on [Session commands](../sessions-cli/#slash-commands).

## The terminal

The terminal is the session's own, so you type into it as you would locally. While a new session starts, it shows a spinner and what the session is doing.

- :kbd[Mod+C] copies the selected text. With nothing selected, it reaches the session as an interrupt.
- :kbd[Mod+V] pastes.
- Links in the output open in a new tab when clicked, including ones that wrap onto the next line.

A session's terminal is sized to one viewer at a time. In any other tab, or on a linked machine, it reads **Active on … — click to take over**; clicking makes it yours and resizes it to your window. A session nobody is viewing goes to whoever looks at it and interacts first.

## Your last message

Your last prompt to the session sits over the top-left of the terminal, cut to one line. Hover to read all of it, or click to pin it open until you press :kbd[Esc] or click elsewhere. Scrolling over it steps back through your earlier prompts, with a counter showing which one you're on.

## Transcripts

Clicking an entry on the sidebar's [History](../sessions-sidebar/#history) tab shows its transcript here in place of the terminal.
