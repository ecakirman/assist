---
id: miro
title: Miro
group: Integrations
order: 5
covers:
  - claude:miro
  - config:miro.extracts
---

Run `/miro` with a board's link to pull the text of every box inside a rectangle on the board, in order, as a YAML list. It suits a board of sticky notes laid out by priority.

The agent shows the board's frames for you to pick one. The frame then opens in the [preview pane](../sessions-preview-panes/): click the top-left box of the area you want, then the bottom-right one. Boxes are listed leftmost first, with the topmost first where they line up.

`/miro` reads boards through Claude's Miro connector, so connect it to your Miro account first.

## Saved extracts

Give the agent a name for the selection and it's saved in `miro.extracts`, with the board, frame, corner boxes, and any list of box texts to leave out or file to write to. Later, `/miro <name>` fetches the board again and extracts the same area without asking you to pick. [`assist miro extract <name>`](../cli-miro/) does the same from the CLI.
