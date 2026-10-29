---
id: cli-tools
title: Other commands
group: CLI
order: 33
covers:
  - cli:screenshot
  - cli:chart
  - cli:mermaid export
  - config:mermaid.krokiUrl
  - cli:deploy init
  - cli:deploy redirect
---

## Screenshots

- `assist screenshot <process>` captures the window of a running Windows app, such as `notepad`, to `screenshot.outputDir`. See [Window screenshots](../screenshots/).

## Charts

- `assist chart` draws a line chart in the terminal from `label value` pairs piped in, one per line, separated by a comma, tab or spaces. `--title <title>` heads it.

  ```bash
  printf 'Mon 3\nTue 7\nWed 5\n' | assist chart --title Deploys
  ```

## Mermaid diagrams

- `assist mermaid export [file]` renders each fenced `mermaid` block in a markdown file to an SVG, named `<file>-<n>.svg`. Without a file, it renders every `.md` file in the current folder. `--out <dir>` writes the SVGs elsewhere, and `--index <n>` renders only the `n`th block.

Diagrams are rendered by [Kroki](https://kroki.io). To use your own Kroki server:

```bash
assist config set mermaid.krokiUrl https://kroki.example.com
```

## Netlify

- `assist deploy init` creates a Netlify site, installing the Netlify CLI if you don't have it, and adds a GitHub workflow that deploys to it. Add a Netlify personal access token to the GitHub repo's secrets as `NETLIFY_AUTH_TOKEN` to finish.
- `assist deploy redirect` adds a script to `index.html` that adds a trailing slash to the URL.
