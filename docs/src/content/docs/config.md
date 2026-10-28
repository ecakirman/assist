---
id: config
title: Config
group: Repo tooling
order: 0
covers:
  - route:/config
  - config:repos
  - cli:config set
  - cli:config unset
---

Every assist setting is a config key, such as `commit.push` or `next.repos`. Change them on the **Config** page, opened from the cog in the toolbar (:kbd[Alt+W]), or with `assist config set`.

## Scopes

A key can be set in three places. For the selected repo, the most specific one wins:

| Scope         | Where it's stored                                | Applies to                                      |
| ------------- | ------------------------------------------------ | ----------------------------------------------- |
| **Project**   | `assist.yml` or `.claude/assist.yml` in the repo | Everyone working in the repo, once committed    |
| **This repo** | The assist database                              | The repo, on every machine sharing the database |
| **Global**    | `~/.assist.yml`                                  | Every repo on this machine                      |

A project value beats a **This repo** value, which beats a global value. A key set nowhere uses its default.

Use **This repo** for personal settings you want in one repo on all your machines without committing them, such as turning on worktrees. Use **Global** for settings that follow you everywhere, such as a branch prefix.

## The Config page

The page shows the effective config for the repo selected in the toolbar, with keys grouped by their first segment (`commit`, `next`, `sessions` and so on).

- Type in **Search** to narrow the list by key or description. Other pages link here with the search filled in, such as **Next settings** on [Next](../next/).
- Each key shows a chip naming where its value comes from: `project`, `repo`, `global` or `default`. Hover the chip to see the file or override it was read from.
- Press the pencil to edit a key. Pick a scope with **Project**, **This repo** or **Global**, then **Save**. A dot marks the scopes that already hold a value.
- **Clear** removes the key from the chosen scope, so the next scope down applies again.
- Lists of entries, such as `run` or `deny`, are edited in place: add, duplicate, reorder or remove entries from each row's buttons.

Keys marked **read-only** are set by a dedicated command, shown under the key.

## From the CLI

`assist config set <key> <value>` writes a key to the repo's `assist.yml`. Add `-g` to write it to `~/.assist.yml` instead, or `-g --repo` to write it to **This repo** in the database. `--repo <name>` targets another repo.

```bash
assist config set commit.push true
assist config set branch.prefix sw -g
assist config set worktree.enabled true -g --repo
```

Lists take comma-separated values, and nested keys can address one entry by index, such as `forbiddenStrings.0.disallowed`. `assist config unset <key>` removes a key, with the same `-g` and `--repo` flags.

Other docs pages write examples without scope flags. Add `-g` or `-g --repo` to any of them to set the key in another scope.

To read config or list every key from a terminal, see [assist config](../cli-config/).
