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
    alt: The News page, listing posts from two feeds under date headings
    route: /news
    scene: news
    waitFor: text=Container queries are ready for production
    viewport:
      width: 1440
      height: 900
---

The **News** page reads the RSS and Atom feeds you've added, newest first. Click a post to open it.

::screenshot{file="news.png"}

Feeds are added with [`assist news add`](../cli-news/). Restart the web server to load posts from a feed you've just added.

The page is always at `/news`. To also show a **News** tab in the toolbar:

```bash
assist config set news.showInNav true
```
