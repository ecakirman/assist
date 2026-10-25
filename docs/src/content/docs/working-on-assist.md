---
id: working-on-assist
title: Working on assist
group: Contributing
order: 0
covers:
  - cli:watch wait
  - cli:watch loop
  - cli:watch simulate-divergence
  - cli:watch report
---

## Run from a clone

To work on assist itself, install it from a clone instead of npm:

```bash
git clone git@github.com:staff0rd/assist.git
cd assist
npm install
npm run build
npm install -g .
```

From then on the daemon keeps the clone built and up to date (see [Getting started](../getting-started/)).

This guide is built from the clone too. It is an Astro Starlight site in `docs/` with its own dependencies: `npm run docs:install` installs them, `npm run docs:build` builds the site into `docs/dist/`, and `npm run docs:preview` serves it on http://localhost:4173, reloading as pages change. Set `DOCS_BASE_PATH=<path>` to build for a site hosted under a sub-path.

## How the update loop works

Lap after lap, the daemon runs `assist watch wait --pull --build` in the clone and logs each lap to `daemon.log` (prefixed `auto-update:`) and to `~/.assist/watchers/`. The same `watch` commands can be run by hand in any repo:

- `assist watch wait [--interval <d>] [--timeout <d>|none] [--pull] [--build [entry]]` blocks until the current branch's upstream gains commits. `--pull` fast-forwards to them, and `--build` then runs the `auto-build` run entry (or `[entry]`), plus `assist sync --yes` when the pulled commits touched files that sync installs. It exits 0 on movement, 2 on timeout, 3 on genuine divergence, 4 when the build or sync fails, and 1 when it cannot wait.
- `assist watch loop` runs `assist watch wait --pull --build` as a fresh child process lap after lap. It relaunches after a 0, 2 or 4 exit, and stops on 1, 3 or an interrupt.
- `assist watch report [--from <sha>]` prints the built version and the last 10 commits as a markdown table. With `--from`, it marks the commits since `<sha>` as new and says which restarts they need and whether `~/.claude` needs a sync.
- `assist watch simulate-divergence` makes the next `assist watch wait` poll in this repo exit 3, so you can test how divergence is handled.
