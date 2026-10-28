---
id: cli-setup
title: Project setup
group: CLI
order: 21
covers:
  - cli:init
  - cli:vscode init
  - cli:verify init
  - cli:lint init
  - cli:new vite
  - cli:new cli
---

These commands set up a TypeScript project with assist's conventions. Run them from the project's root.

## Setting up an existing project

- `assist init` runs `assist vscode init` and then `assist verify init`.
- `assist vscode init` adds VS Code settings, recommended extensions and a launch configuration, letting you pick which.
- `assist verify init` offers the usual [verify checks](../verify/) the project doesn't have yet, such as lint, formatting, tests, unused code, duplicate code and maintainability, then installs their tools and adds the ones you pick as `verify:*` run commands. `--package-json` adds them as `package.json` scripts instead.
- `assist lint init` replaces ESLint with oxlint, writing a baseline `.oxlintrc.json`.

## Starting a new project

Run these in an empty folder:

- `assist new vite` creates a Vite React TypeScript app, initialises git, removes ESLint, runs `assist vscode init` and `assist verify init`, then sets up a Netlify deploy.
- `assist new cli` creates a TypeScript command-line app built with tsup, named after the folder, initialises git, runs `assist init` and then [`assist verify`](../verify/).
