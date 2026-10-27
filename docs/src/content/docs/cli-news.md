---
id: cli-news
title: assist news
group: CLI
order: 9
covers:
  - cli:news add
  - cli:news list
  - cli:news remove
---

## Commands

These commands edit the `news.feeds` config key, the RSS and Atom feeds shown on the [News](../news/) page.

- `assist news add [url]` adds a feed. Without a URL it asks for one.
- `assist news list` prints the feeds, one per line.
- `assist news remove <url>` removes a feed.
