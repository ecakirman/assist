---
id: cli-daemon
title: assist daemon
group: CLI
order: 2
covers:
  - cli:daemon run
  - cli:daemon status
  - cli:daemon stop
  - cli:daemon restart
  - cli:daemon drain
---

These manage the [sessions daemon](../sessions-daemon/), which logs to `~/.assist/daemon/daemon.log`.

## Commands

- `assist daemon status` shows whether the daemon is running, its live sessions, its links to other machines and any stray daemon processes.
- `assist daemon restart` restarts it. Claude sessions carry on their conversations, with fresh scrollback; run sessions come back as not-restored cards you can retry. A session the restart interrupted mid-turn is told so when it resumes.
- `assist daemon stop` stops it. Running Claude sessions resume the next time it starts.
- `assist daemon drain` removes every session for a clean slate. It lists the live sessions and asks first (`--yes` skips the question), and a session holding unpushed work is stopped rather than removed.
- `assist daemon run` runs the daemon in the foreground, which is useful when debugging it.
