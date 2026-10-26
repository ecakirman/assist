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

When assist is installed from a git clone, it keeps itself up to date in the background. When the clone's upstream gets new commits, assist pulls and installs them.

The Updates panel opens from the version badge on the dashboard, or with :kbd[Alt+Q]. When a new build is ready, it shows **Restart to update** and which part needs restarting, the web server or the daemon. **Restart** does it for you.

::screenshot{file="updates-panel.png"}

If the clone has local commits and cannot fast-forward, assist starts a Claude session in it to rebase or merge onto the upstream, push and rebuild. Updates pause until that session closes.

To turn automatic updates off:

```bash
assist config set autoUpdate.enabled false
```

A global npm install is not updated automatically.

## Manual updates

```bash
assist update
```

`assist update` updates assist, whether it was installed from npm or from a git clone.

When the sessions daemon is running, `assist update` restarts it so it loads the new build. Restart the web server yourself, then reload the browser tab.
