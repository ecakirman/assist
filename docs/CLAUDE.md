## Rules

- **R3** — **CLI-only commands under CLI** — Document a command that only exists on the CLI, with no web UI or slash command driving it, on a page in the CLI nav group, not on a feature area page
- **R4** — **No implementation details** — Describe what a feature does for the user; do not explain which commands, hooks or internals implement it
- **R5** — **Only actionable behaviour** — Document only the actions a user can take and the settings they can change. Leave out anything the app does on its own, whether it shows, asks, warns or prevents something: the user meets it when it happens and needs nothing from the docs to handle it
- **R6** — **Never start docs preview** — Never start the docs preview server; the user runs it, so assume it is already running when asking for a review
- **R7** — **No config scope flags** — Write config examples as `assist config set <key> <value>` with no scope flags; explain global and per-repo scope only on the config page
- **R8** — **Internal commands under CLI** — A command that an agent, slash command or hook runs on the user's behalf is internal: mark it with `internalCommand` and document it only on a CLI page with `:badge[internal]` and who calls it, never on a feature area page
