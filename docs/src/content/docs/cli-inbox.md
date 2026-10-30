---
id: cli-inbox
title: assist inbox
group: CLI
order: 34
covers:
  - cli:inbox scan
  - cli:inbox list
---

## Commands

These commands find messages people sent you in Gmail and Slack that look like they need a reply.

- `assist inbox scan` checks your unread Gmail inbox, and your Slack DMs and @mentions since the last scan, and saves each message that needs a reply.
- `assist inbox list` prints the saved messages, newest first, with the sender, source, summary and link.
