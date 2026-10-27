---
id: news
title: News
group: Activity
order: 2
covers:
  - route:/news
  - config:news.showInNav
screenshots:
  - file: news.png
    alt: The News page, listing AI news posts from two feeds under date headings
    route: /news
    scene: news
    waitFor: text=Coding agents now run for hours without a check-in
    viewport:
      width: 1440
      height: 900
---

Waiting on agents can be boring, and the **News** page gives you something to read in the meantime, like the latest in AI. It collects posts from the RSS and Atom feeds you've added, newest first. Click a post to open it.

::screenshot{file="news.png"}

Add feeds with [`assist news add`](../cli-news/). Restart the web server to load posts from a feed you've just added.

The page is always at `/news`. To also show a **News** tab in the toolbar:

```bash
assist config set news.showInNav true
```
