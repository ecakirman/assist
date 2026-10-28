---
id: merge-conflicts
title: Merge conflicts
group: Git and GitHub
order: 5
covers:
  - claude:fix-conflict
---

When a pull request conflicts with the default branch, pick it from the toolbar's [PRs menu](../pull-requests/#the-prs-menu) and choose:

- **Fix conflicts (merge)** merges the latest default branch into the pull request's branch.
- **Fix conflicts (rebase)** rebases the branch onto the latest default branch.

Either starts an agent in a new session on the pull request's branch. It resolves each conflict keeping both sides' intent, checks the result passes [verify](../verify/), and pushes. When a conflict needs a product decision, it asks you.

In a session already on the branch, run `/fix-conflict`, or `/fix-conflict --rebase`.
