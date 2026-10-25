---
id: updating
title: Updating assist
group: Getting started
order: 1
covers:
  - cli:update
  - config:autoUpdate.enabled
screenshots:
  - file: updates-panel.png
    alt: The Updates panel
    route: /updates
---

## Automatic updates

When assist is installed from a git clone, it keeps itself up to date in the background. It watches the clone's upstream, pulls new commits, rebuilds, and re-runs `assist sync` when the commits change anything sync installs.

When a new build is ready, the Updates panel shows **Restart to update** and which part needs restarting, the web server or the daemon. **Restart** does it for you.

::screenshot{file="updates-panel.png"}

If the clone has local commits and cannot fast-forward, assist starts a Claude session in it to rebase or merge onto the upstream, push and rebuild. Updates pause until that session closes.

To turn automatic updates off:

```bash
assist config set autoUpdate.enabled false -g
```

A global npm install is not updated automatically.

## Manual updates

```bash
assist update
```

`assist update` detects how assist was installed:

- **Global npm install** — installs `@staff0rd/assist@latest`, then runs `assist sync`.
- **Git clone** — pulls, runs `npm i` and `npm run build` in the clone, then runs `assist sync`.

When the sessions daemon is running, `assist update` restarts it so it loads the new build. Restart the web server yourself, then reload the browser tab.
