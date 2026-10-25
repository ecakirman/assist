---
id: cli-sessions
title: assist sessions
group: CLI
order: 3
covers:
  - cli:sessions summarise
---

## Transcript summaries

`assist sessions summarise` asks Claude for a one-line summary of each Claude transcript under `~/.claude/projects` that doesn't have one yet, and saves it next to the transcript as a `.summary` file. `--force` regenerates existing summaries and `-n <count>` limits how many it does in one run.
