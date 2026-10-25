---
id: sessions-daemon
title: The sessions daemon
group: Sessions
order: 6
covers:
  - cli:daemon run
  - cli:daemon status
  - cli:daemon stop
  - cli:daemon restart
  - cli:daemon drain
  - config:sessions.maxLive
---

## Where sessions live

Sessions belong to a background daemon, not the web server or the browser tab. Closing the tab or restarting the web server leaves every session running with its scrollback, and any number of browser tabs can watch the same sessions. The web server starts the daemon when it isn't already running, and the daemon exits by itself once it has no sessions and no client has connected for 60 seconds.

## Managing it

- `assist daemon status` shows whether the daemon is running, its live sessions, its links to other machines and any stray daemon processes.
- `assist daemon restart` restarts it. Claude sessions are resumed with `claude --resume` and their scrollback starts fresh; run sessions come back as not-restored cards you can retry. A session the restart interrupted mid-turn is told so when it resumes.
- `assist daemon stop` stops it. Running Claude sessions resume the next time it starts.
- `assist daemon drain` removes every session for a clean slate. It lists the live sessions and asks first (`--yes` skips the question), and a session holding unpushed work is stopped rather than removed.
- `assist daemon run` runs the daemon in the foreground, which is useful when debugging it.

The daemon logs to `~/.assist/daemon/daemon.log`.

## Session limit

One daemon holds at most 24 live sessions, and starting another past that is refused. A restart also brings back at most that many. Change the ceiling with:

```bash
assist config set sessions.maxLive 32 -g
```
