import type { ConfigHelpEntry } from "../../shared/configHelp";

export const runConfigHelp: ConfigHelpEntry[] = [
	{
		key: "run",
		setter:
			"assist run add <name> <command> [--env KEY=VALUE] [--pre <cmd>] [--param <spec>] [--server [group]] [--repo] (see --help)",
		note: "configured commands runnable via assist run <name>",
	},
];
