---
id: cli-data-sources
title: assist sql, ravendb and seq
group: CLI
order: 22
covers:
  - cli:sql auth add
  - cli:sql auth list
  - cli:sql auth remove
  - cli:sql set-connection
  - cli:sql query
  - cli:sql mutate
  - cli:sql tables
  - cli:sql columns
  - cli:ravendb auth add
  - cli:ravendb auth list
  - cli:ravendb auth remove
  - cli:ravendb set-connection
  - cli:ravendb query
  - cli:ravendb collections
  - cli:seq auth add
  - cli:seq auth list
  - cli:seq auth remove
  - cli:seq set-connection
  - cli:seq query
---

See [Databases and logs](../data-sources/) for having an agent query these for you. Every command that takes a `connection` uses the default connection when you leave it out.

## Connections

Each of `sql`, `ravendb` and `seq` has the same connection commands:

- `assist sql auth add` asks for a connection's name and details and adds it. The first one becomes the default.
- `assist sql auth list` lists the connections.
- `assist sql auth remove <name>` removes one.
- `assist sql set-connection <name>` makes one the default.

## assist sql

- `assist sql query "<sql>" [connection]` runs a read-only statement against SQL Server and prints the rows as a table. It refuses a statement that changes anything.
- `assist sql mutate "<sql>" [connection]` runs a statement that changes data or schema and prints the rows affected. It refuses a plain `SELECT`.
- `assist sql tables [connection]` lists the tables.
- `assist sql columns <table> [connection]` lists a table's columns. Name a table outside the default schema as `schema.table`.

## assist ravendb

- `assist ravendb collections [connection]` lists the collections and their document counts.
- `assist ravendb query [connection] [collection]` prints a collection's documents, newest first.
  - `--query <lucene>` filters them with a Lucene query.
  - `--sort <field>` sorts by another field; prefix it with `-` for descending.
  - `--limit <n>` stops after `n` documents, and `--page-size <n>` sets how many are fetched at a time.

## assist seq

- `assist seq query <filter>` prints the latest 50 events matching a Seq filter expression, such as `@Level = 'Error'`.
  - `-c <name>` queries another connection.
  - `-n <count>` fetches a different number of events.
  - `--from` and `--to` limit the time window, as UTC dates or ages such as `1h` or `2d`.
  - `--json` prints the raw events.
