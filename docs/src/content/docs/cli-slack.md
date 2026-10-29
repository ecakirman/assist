---
id: cli-slack
title: assist slack
group: CLI
order: 24
covers:
  - cli:slack post
---

## Commands

- `assist slack post [channel] --body <markdown>` :badge[internal] opens a message bound for a Slack channel, `slack.channel` by default, in the [preview pane](../sessions-preview-panes/) for approval, without posting it. `--body -` reads the message from stdin, `--parts <files...>` previews the messages of a thread one after another, and `--thread <ts-or-permalink>` replies in a thread. Called by [`/slack-post`](../slack/), which posts the approved messages.
