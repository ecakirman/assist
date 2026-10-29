---
id: cli-devlog
title: assist devlog
group: CLI
order: 27
covers:
  - cli:devlog list
  - cli:devlog next
  - cli:devlog version
  - cli:devlog skip
  - cli:devlog repos
---

See [Devlog](../devlog/) for writing entries with `/devlog`.

## Commands

- `assist devlog list` prints the last 30 days of commits, grouped by day, with each day's devlog entry. `--days <n>` or `--since <date>` changes the range, `-r` lists the earliest first, and `-v` adds the files each commit changed.
- `assist devlog next` prints the commits of the next day without an entry, and the versions to choose from. `-v` adds the files each commit changed.
- `assist devlog version` prints the repo's name, its last devlog version and the next patch version.
- `assist devlog skip <date>` adds a `YYYY-MM-DD` date to `devlog.skip`, so it gets no entry.
- `assist devlog repos` lists your GitHub repos pushed to in the last 30 days, and whether each one's devlog is missing, behind or up to date. `--days <n>` changes the window, and `--all` lists every repo that isn't archived.
