---
id: jira
title: Jira
group: Integrations
order: 3
covers:
  - claude:jira
  - config:jira.acField
---

Run `/jira` in a session to work with a Jira issue. Name an issue by its key, such as `PROJ-12`. When you leave it out, the issue linked to the session's [backlog item](../backlog/) is used.

| Command                      | Does                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `/jira <key>`                | Shows the issue in the session                                                                                           |
| `/jira associate <key> [id]` | Links the issue to a backlog item, the session's own by default                                                          |
| `/jira update [key]`         | Comments on the issue with a summary of the session's work, once you approve it. A sub-task's comment goes on its parent |
| `/jira started [key]`        | Assigns the issue to you and moves it to In Progress                                                                     |
| `/jira done [key]`           | Moves the issue to Done                                                                                                  |
| `/jira help`                 | Lists these                                                                                                              |

`/jira` reaches Jira through Claude's Atlassian connector, so connect it to your Jira site first.

## Acceptance criteria

[`assist jira ac`](../cli-jira/) reads an issue's acceptance criteria from a custom field. If your Jira site keeps them in a field other than `customfield_11937`, set it:

```bash
assist config set jira.acField customfield_10042
```
