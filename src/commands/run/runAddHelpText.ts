const properties: [key: string, flag: string, note: string][] = [
	["name", "<name>", "what you type after assist run"],
	["command", "<command>", "executable to spawn"],
	["args", "[args...]", "static args appended to the command"],
	["cwd", "--cwd <dir>", "working directory, relative to the config file"],
	[
		"env",
		"--env KEY=VALUE",
		"environment variable for the command (repeatable)",
	],
	["server", "--server [group]", "singleton dev server, optionally grouped"],
	["port", "--port <port>", "display-only port on the serving card"],
	[
		"pre",
		"set in config",
		"shell commands run before this one, each as a list item",
	],
	[
		"filter",
		"set in config",
		"verify: entries only run when a changed file matches this glob",
	],
	["quiet", "set in config", "suppress the command's output unless it fails"],
	[
		"params",
		"set in config",
		"positional params (name, required, default, description)",
	],
];

const width = Math.max(...properties.map(([key]) => key.length));
const flagWidth = Math.max(...properties.map(([, flag]) => flag.length));

export const runAddHelpText = [
	"",
	"Run entry properties:",
	...properties.map(
		([key, flag, note]) =>
			`  ${key.padEnd(width)}  ${flag.padEnd(flagWidth)}  ${note}`,
	),
	"",
	'The command is spawned without a shell, so "FOO=bar cmd", "&&", pipes and redirects do not work; use --env for environment variables and pre for setup steps.',
	"",
	'Options go after <command>. --server and --repo take the next argument as their value unless it starts with "-", so put them last or before another option:',
	"  assist run add dev npm run dev --env PORT=3000 --server --port 3000 --repo",
	"",
	"Properties marked 'set in config' are edited in assist.yml directly, e.g.:",
	"  params:",
	'    - name: env        # assist run deploy prod → appends "prod"',
	"      required: true",
	"    - name: tag",
	"      default: latest",
].join("\n");
