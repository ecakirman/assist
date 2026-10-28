---
id: cli-git
title: assist branch and assist commit
group: CLI
order: 12
covers:
  - cli:branch
  - cli:commit
---

## Commands

- `assist branch <slug>` :badge[internal] creates and switches to a branch named `[<prefix>/][<JIRA>-]<slug>` off the latest remote default branch. `--jira <key>` adds the Jira key and `--from <ref>` branches off another ref. Called by [`/branch`](../branches-and-commits/#branching).
- `assist commit status` :badge[internal] shows the working tree's state. Called by [`/commit`](../branches-and-commits/#committing).
- `assist commit <message> [files...]` :badge[internal] stages the files, if any, and commits them, following the [commit settings](../branches-and-commits/#committing). `--ref <ref>` adds a `Ref:` trailer and can be repeated. Called by `/commit`.
