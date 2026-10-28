---
id: cli-prs
title: assist prs
group: CLI
order: 13
covers:
  - cli:prs
  - cli:prs raise
  - cli:prs edit
  - cli:prs status
  - cli:prs slack-channel
  - cli:prs list-comments
  - cli:prs fixed
  - cli:prs wontfix
  - cli:prs reply
  - cli:prs comment
  - cli:prs read-time
  - cli:read-time
  - config:readTime.wordsPerMinute
  - config:prs.readingWordsPerMinute
---

## Listing pull requests

`assist prs` pages through the current repo's pull requests. `--open` or `--closed` shows only those.

## Reading time

`assist read-time <target>`, also `assist prs read-time`, estimates how long a document takes to read and judges it against a budget. The target is a pull request number or URL, a file path, or `-` for stdin. `--budget <duration>`, such as `45s` or `2m`, changes the budget from 1 minute.

Set your reading speed in words per minute:

```bash
assist config set readTime.wordsPerMinute 250
```

`prs.readingWordsPerMinute` is the same setting under its former name, read only when `readTime.wordsPerMinute` is unset.

## Raising and editing

- `assist prs raise` :badge[internal] raises the current branch's [pull request](../pull-requests/) from `--title`, `--what`, `--why` and an optional `--how`, with `--resolves`, `--screenshot`, `--draft` and `gh`'s reviewer, label, assignee and milestone options. Called by `/pr`.
- `assist prs edit` :badge[internal] replaces only the title or sections passed to it. Called by agents revising their pull request.
- `assist prs status <owner/repo...>` :badge[internal] reports every open pull request in those repos. `--json` prints it as JSON. Called by `/prs-status`.
- `assist prs slack-channel` :badge[internal] prints the Slack channel pull requests are announced to. Called by `/prs-slack`.

## Review comments

- `assist prs list-comments` :badge[internal] lists the current branch's pull request comments, unresolved threads first. Called by `/review-pr-comments`.
- `assist prs fixed <comment-id> <sha>` :badge[internal] replies with a link to the commit and resolves the thread. Called by `/review-pr-comments`.
- `assist prs wontfix <comment-id> <reason>` :badge[internal] replies with the reason and resolves the thread. Called by `/review-pr-comments`.
- `assist prs reply <comment-id> <body>` :badge[internal] replies without resolving. Called by `/review-pr-comments`.
- `assist prs comment <path> <line> <body>` :badge[internal] adds a line comment. Called by `/comment` and `/forward-comments`.

A body or reason of `-` is read from stdin.
