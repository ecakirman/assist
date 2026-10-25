---
id: sessions-daemon
title: The sessions daemon
group: Sessions
order: 6
covers:
  - config:sessions.maxLive
---

## Where sessions live

Sessions belong to a background daemon, not the web server or the browser tab. Closing the tab or restarting the web server leaves every session running with its scrollback, and any number of browser tabs can watch the same sessions. The web server starts the daemon when it isn't already running, and the daemon exits by itself once it has no sessions and no client has connected for 60 seconds.

## Restarting it

When a new build is ready, **Restart** on the [Updates panel](../updating/#automatic-updates) restarts the daemon. Claude sessions carry on their conversations, with fresh scrollback; run sessions come back as not-restored cards you can retry. A session the restart interrupted mid-turn is told so when it resumes. To check on, stop or clear out the daemon, use [`assist daemon`](../cli-daemon/).

## Session limit

One daemon holds at most 24 live sessions, and starting another past that is refused. A restart also brings back at most that many. Change the ceiling with:

```bash
assist config set sessions.maxLive 32 -g
```
