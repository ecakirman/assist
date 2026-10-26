---
id: sessions-pr-review
title: Reviewing pull requests
group: Git and GitHub
order: 1
covers:
  - cli:review
  - config:review.codexModel
screenshots:
  - file: sessions-review-menu.png
    alt: The Review menu on a session with a pull request
    route: /sessions
    scene: previews
    setup:
      - openPr:
          repo: sandbox
          number: 14
          title: Add a dark mode toggle to settings
    waitFor: text=Dark mode toggle
    viewport:
      width: 1280
      height: 560
    actions:
      - click: text=Dark mode toggle
      - click: "[data-testid=session-top-bar] >> text=Review"
---

A session with a pull request has a **Review** button on its card and in its [top bar](../sessions-session-area/#the-top-bar). It starts a review of the pull request in a new session, where Claude and Codex each review it and their findings are combined into one list.

## Choosing a review

The **Review** menu offers:

::screenshot{file="sessions-review-menu.png"}

| Mode              | What happens to the findings                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| Review            | You're asked whether to post them to the pull request as line comments and submit the review                         |
| Review & refine   | You walk through them with the agent, dropping or rewording each, then post what's left with another **Review**      |
| Review & apply    | For each one you choose apply or skip; applied findings are fixed in the working copy, and skipped ones stay to post |
| Review & post     | They are posted and the review submitted without asking                                                              |
| High-level review | Opens the [high-level review](../sessions-high-level-review/) checklist instead                                      |

Tick these in the menu before picking a mode to add them:

- **Force re-run** reviews the pull request again from scratch instead of reusing an earlier review of the same commit.
- **Address comments after** starts a session that works through the pull request's review comments once the review is posted.
- **Announce to Slack after** announces the pull request in Slack at the end.

**Address Comments** skips the review and starts that session straight away.

## Reading the findings

When a review has finished, its session's card has a **Findings** button that shows the combined findings.

## Choosing the Codex model

The Codex reviewer uses your own Codex login. To run it on a model through your LiteLLM proxy instead:

```bash
assist config set review.codexModel gpt-5-codex
```

## From the command line

`assist review [number]` reviews the current branch's pull request, or checks out pull request `number` first. The menu's modes and options are flags:

- `--refine`, `--apply` and `--high-level` match the menu's modes, and `--no-prompt --submit` matches **Review & post**.
- `--submit` answers yes to posting by default, and `--no-prompt` skips every question.
- `--backlog` files the findings as one [backlog](../backlog/) bug, with a phase per finding, instead of posting them.
- `--force`, `--address-comments` and `--announce` match the menu's options.
- `--checkout-only` checks the pull request out and leaves an idle agent in it, without reviewing.
- `--verbose` prints a line per step instead of spinners.
