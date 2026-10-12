# Releases

The Releases page renders exactly the JSON from:

```
curl -s "http://localhost:3100/api/releases/state?cwd=<url-encoded repo path>"
```

`cwd` is the repo selected in the page's repo picker. gh results are cached for 30s, and relative ages are computed in the browser at render time.

The queued-commit popover fetches separately, on click, from:

```
curl -s "http://localhost:3100/api/releases/compare?cwd=<cwd>&repo=<owner/name>&base=<live sha>&head=<queued sha>"
```

It returns `{ total, commits }`, the newest 50 commits of `base...head`, newest first. Without `base` (no live deployment) it returns just the `head` commit.
