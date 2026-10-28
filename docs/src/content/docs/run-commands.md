---
id: run-commands
title: Run commands
group: Repo tooling
order: 1
covers:
  - config:run
  - claude:add-command
  - cli:run
  - cli:run add
---

Run commands are a repo's named commands, such as its dev server, build or tests. Name them once and anyone, or any agent, runs them the same way with `assist run <name>`, and the dashboard's run menu starts the dev servers among them as [run sessions](../sessions-creating/) beside the agents using them.

## Adding a command

Run `/add-command` in a session and describe the command. The agent picks the right options and checks the command works.

Or add it yourself with `assist run add <name> <command> [args...]`:

```bash
assist run add dev npm run dev --cwd web --env PORT=3000 --server --port 3000
assist run add build tsc -p .
```

The command is started without a shell, so `FOO=bar cmd`, `&&`, pipes and redirects don't work. Use the options instead:

| Option             | Effect                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `--cwd <dir>`      | Working directory, relative to the config file                                                      |
| `--env KEY=VALUE`  | Sets an environment variable. Repeatable                                                            |
| `--pre <command>`  | Runs a shell command first. Repeatable, run in order                                                |
| `--server [group]` | Marks it as a dev server: only one per group runs at a time, and the run menu lists it              |
| `--port <port>`    | Port shown on the server's card                                                                     |
| `--param <spec>`   | Adds a positional parameter. See below. Repeatable                                                  |
| `--filter <glob>`  | For a `verify:` command, only runs it when a changed file matches. See [Verify](../verify/)         |
| `--quiet`          | Hides the output unless the command fails                                                           |
| `--repo [name]`    | Stores it in **This repo** in the database instead of `assist.yml`. See [Config](../config/#scopes) |

Put options after `<command>`. To pass one of these flags to the command itself, quote the whole command: `assist run add build "pnpm --filter web build"`.

### Parameters

Each `--param` fills the next argument given to `assist run`:

- `<name>` is optional and left out when not given.
- `<name>!` is required.
- `<name>=<default>` uses the default when not given.

```bash
assist run add deploy ./deploy.sh --param env! --param tag=latest
assist run deploy prod
```

This runs `./deploy.sh prod latest`. To describe a parameter in `assist run deploy --help`, add a `description` to it in `assist.yml`.

## Running a command

Start a dev server from the toolbar's run menu, or run any command from a terminal with `assist run <name> [args...]`. Extra arguments fill its parameters, then pass on to the command.

To list, remove or share commands, see [assist run](../cli-run/).
