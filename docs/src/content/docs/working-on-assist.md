---
id: working-on-assist
title: Working on assist
group: Contributing
order: 0
covers: []
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
