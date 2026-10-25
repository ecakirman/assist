---
id: sessions-parallel-work
title: Parallel work
group: Sessions
order: 4
covers:
  - config:worktree.enabled
  - config:worktree.trunk
  - config:worktree.root
  - config:worktree.install
  - config:worktree.copy
  - config:worktree.commitBeforePhaseEnd
  - config:worktree.commitBeforeManualChecks
---

## Several sessions on one repo

By default every session in a repo shares the clone's working copy, so two agents editing the same repo see each other's changes. Turn on parallel work for a repo to give each session its own git worktree instead:

```bash
assist config set worktree.enabled true -g --repo
```

With it on:

- The first prompt session uses the clone itself. A second concurrent one lands in `<repo>-2`, a third in `<repo>-3`, and so on. You never choose or name these.
- Every assist-command session (draft, bug, backlog run, review and so on) gets a fresh worktree off the freshly fetched remote default branch, so it never works against whatever branch the clone is on.
- The repo picker and the History tab still show the repo once, covering the clone and all its worktrees.
- A worktree is reused once nothing live works in it and it holds nothing unpushed.
- Asking to run a backlog item that already has a live run is refused, pointing at the run that holds it.

The card's clone badge shows which working copy a session is in.

Turning parallel work off leaves the repo as it was; nothing permanent is written to the clone.

## Work is never lost

A worktree is removed only when the last session holding it is done or closed, and only when nothing in it is unpushed. Closing a session that still holds unpushed changes stops it instead: the card stays on the board as **stopped**, and the only actions are resume, restart or an explicit discard. Discard always asks first and names what it is about to destroy.

The same applies to a session in the clone's own working copy, though the clone itself is never removed. When several agents share a worktree, only the last one to leave triggers this.

After a crash, kill or reboot, the daemon cleans up stray worktrees itself; you never prune them by hand.

## Worktree settings

All of these are per repo, so set them with `--repo`:

- `worktree.trunk` — trunk-based work. A spilled worktree's branch tracks `origin/<trunk>` so commits land on the mainline, and jobs that commit (`backlog run`, PR checkouts, reviews) always run in a worktree, never the clone. Off (the default), a worktree starts off the remote default branch with no upstream, and the session raises its own branch and PR.
- `worktree.root` — the parent directory for `<repo>-N` worktrees. Defaults to the clone's parent.
- `worktree.install` — how a new worktree installs its dependencies. `true` (the default) detects pnpm, yarn, bun or npm; a string is the install command to run; `false` skips it; a JSON list of paths installs in each in order, stopping at the first failure:

  ```bash
  assist config set worktree.install '[".","packages/ui"]' -g --repo
  ```

- `worktree.copy` — gitignored files to copy into each new worktree so it can build and run, such as `.env`:

  ```bash
  assist config set worktree.copy .env,.claude/settings.local.json -g --repo
  ```

- `worktree.commitBeforePhaseEnd` — makes each backlog phase run `/commit` once verify passes, before it asks you to perform manual checks or marks the phase done, so a phase's work is never left uncommitted in a worktree that may be reaped. Off by default. `worktree.commitBeforeManualChecks` is its older name and is still read when `commitBeforePhaseEnd` is unset.
