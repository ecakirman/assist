---
id: cli-db
title: assist db
group: CLI
order: 32
covers:
  - cli:db status
  - cli:db drop-retired
  - cli:db-migration unlock
  - cli:db-migration confirm
---

[Getting started](../getting-started/) sets up the database and applies its migrations with `assist db migrate`.

## Commands

- `assist db status` prints whether the database matches this version of assist, is behind it and needs `assist db migrate`, or is ahead of it and assist needs updating.
- `assist db drop-retired` drops the tables of features assist no longer has, asking about each one first.

## Migration approval

These apply when working on assist itself, where an agent can't add a database migration without your approval.

- `assist db-migration unlock` :badge[internal] sends a pin to your desktop notifications, authorising the next migration. Called by agents whose new migration the edit hook blocked.
- `assist db-migration confirm <pin>` :badge[internal] approves writing that one migration. Called by agents whose new migration the edit hook blocked, with the pin you give them.
