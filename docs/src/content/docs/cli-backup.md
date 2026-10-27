---
id: cli-backup
title: assist backup
group: CLI
order: 11
covers:
  - cli:backup
  - cli:backup schedule
  - cli:backup schedule status
  - cli:backup schedule remove
  - config:backup.dir
---

## Commands

- `assist backup [--out <dir>]` writes a dump of the assist database, holding every repo's backlog, and lists it on the [Backups](../backups/) page. Dumps go to `backup.dir`, default `~/.assist/backups`, unless `--out` names another directory.
- `assist backup schedule --every <duration>` runs `assist backup` on a schedule, using cron on Linux. Durations are minutes that divide an hour, such as `15m` or `30m`, or hours that divide a day, such as `6h` or `12h`. Running it again replaces the schedule.
- `assist backup schedule status` prints the current schedule.
- `assist backup schedule remove` removes the schedule.

Restore a dump with `assist backlog import <file>`, see [assist backlog](../cli-backlog/).

## Config

```bash
assist config set backup.dir ~/backups/assist
```

Scheduled runs log to `cron.log` in `backup.dir`.
