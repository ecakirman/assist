---
id: screenshots
title: Window screenshots
group: Integrations
order: 11
covers:
  - claude:screenshot
  - config:screenshot.outputDir
---

On Windows, run `/screenshot` and name a running app, such as `/screenshot notepad`, to capture its window. The agent can then look at the screenshot. [`assist screenshot`](../cli-tools/) does the same from the CLI.

Screenshots are saved to `./screenshots`. To save them elsewhere:

```bash
assist config set screenshot.outputDir ./docs/images
```
