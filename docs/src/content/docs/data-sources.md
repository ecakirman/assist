---
id: data-sources
title: Databases and logs
group: Integrations
order: 2
covers:
  - claude:sql
  - claude:raven
  - claude:seq
  - claude:supabase
  - config:sql.connections
  - config:sql.defaultConnection
  - config:ravendb.connections
  - config:ravendb.defaultConnection
  - config:seq.connections
  - config:seq.defaultConnection
---

These commands let an agent query a database or log server for you. Ask in plain words, such as `/sql which orders shipped late last week?`, and the agent works out the query, runs it and summarises the results.

| Command     | Queries                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `/sql`      | A Microsoft SQL Server database. It reads the schema first, and only changes data you ask it to |
| `/raven`    | A RavenDB database's collections                                                                |
| `/seq`      | Seq log events. Pass a filter expression, or paste a link from the Seq UI                       |
| `/supabase` | A Supabase project, through the Supabase CLI you have installed and logged in                   |

## Adding a connection

The agent never adds a connection itself. Add each one once, giving it a name:

```bash
assist sql auth add
assist ravendb auth add
assist seq auth add
```

The first connection you add becomes the default, which the agent uses unless you name another in your prompt. Change it with `set-connection`, such as `assist sql set-connection reporting`. [`assist sql`, `ravendb` and `seq`](../cli-data-sources/) lists every command.

For `/seq`, a pasted Seq link picks the connection whose URL it matches.
