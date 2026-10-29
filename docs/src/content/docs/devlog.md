---
id: devlog
title: Devlog
group: Integrations
order: 10
covers:
  - claude:devlog
  - config:devlog.name
  - config:devlog.ignore
  - config:devlog.skip
---

A devlog is a dated, versioned entry per day of work on a repo, written for a blog. assist writes the entries into `~/git/blog/src/content/devlog/`.

## Writing entries

Run `/devlog` in a repo to write the entry for the next day that has commits but no entry. The agent reads that day's commits, picks a patch or minor version from what changed, and writes a first-person summary. A day of only trivial changes is skipped instead. `/devlog --all` keeps going until every day is written or skipped.

## Settings

| Key             | Effect                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------- |
| `devlog.name`   | The name entries are tagged with. Defaults to the name in `package.json`                 |
| `devlog.ignore` | Paths whose changes don't count: a commit that only touches files under them is left out |
| `devlog.skip`   | Dates never to write an entry for. Add one with [`assist devlog skip`](../cli-devlog/)   |
