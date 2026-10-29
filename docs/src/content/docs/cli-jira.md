---
id: cli-jira
title: assist jira
group: CLI
order: 23
covers:
  - cli:jira auth
  - cli:jira view
  - cli:jira ac
---

These commands use the Atlassian CLI, `acli`. See [Jira](../jira/) for working with issues from a session.

## Commands

- `assist jira auth` asks for your Jira site, email and an [API token](https://id.atlassian.com/manage-profile/security/api-tokens), and logs `acli` in with them.
- `assist jira view <key>` prints an issue's title and description.
- `assist jira ac <key>` prints an issue's acceptance criteria, read from the field in `jira.acField`.
