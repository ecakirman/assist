---
id: slack
title: Slack
group: Integrations
order: 4
covers:
  - claude:slack-post
  - config:slack.channel
---

Run `/slack-post` to have the agent write a Slack message and post it for you:

```text
/slack-post #team summary of what we shipped today
```

The message opens in the [preview pane](../sessions-preview-panes/) first. Approve it and it's posted; reject it with a reason or inline comments and the agent revises it. Ask for several messages and they're posted as a thread, each previewed in turn, once you've approved them all.

Pass `--thread` with a message's link to reply in its thread instead.

`/slack-post` posts through Claude's Slack connector, so connect it to your workspace first.

## Default channel

Leave out the channel and the message goes to `slack.channel`:

```bash
assist config set slack.channel "#team"
```
