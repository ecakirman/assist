---
id: branches-and-commits
title: Branches and commits
group: Git and GitHub
order: 0
covers:
  - claude:branch
  - claude:commit
  - config:branch.prefix
  - config:branch.defaultBranch
  - config:prs.required
  - config:commit.conventional
  - config:commit.pull
  - config:commit.push
  - config:commit.expectedBranch
---

## Branching

Run `/branch <description>` in a session to start a branch for the work. The agent turns the description into a short name and branches off the latest remote default branch, so the branch starts from what everyone else has merged rather than from a stale local copy.

Branch names follow `[<prefix>/][<JIRA>-]<slug>`, such as `sw/BAD-671-add-login-form`:

- Pass `--jira <KEY>` to put a Jira key in the name. In a [backlog](../backlog/) run, the item's linked Jira key is used.
- Set a prefix, such as your initials, to keep your branches together:

  ```bash
  assist config set branch.prefix sw
  ```

- Branches come off the remote's default branch. To branch off another one instead:

  ```bash
  assist config set branch.defaultBranch develop
  ```

### Branches for backlog items

[Running a backlog item](../backlog-running/) puts it on its own branch, named after the item, and later phases carry on on that branch. To run items on whatever branch the session is already on:

```bash
assist config set prs.required false
```

## Committing

Run `/commit` to commit what the session changed. The agent commits only the files that belong to the session's work, leaving anything else in the working tree alone, with a short message in the repo's style.

These settings shape every commit made through assist:

| Key                     | Effect                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `commit.conventional`   | Messages must use [conventional commit](https://www.conventionalcommits.org/) prefixes such as `feat:` and `fix:` |
| `commit.pull`           | Pulls before committing                                                                                           |
| `commit.push`           | Pushes after committing                                                                                           |
| `commit.expectedBranch` | Warns when committing on any branch but this one, such as `main`                                                  |

```bash
assist config set commit.conventional true
assist config set commit.push true
```
