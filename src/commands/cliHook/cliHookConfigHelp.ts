import type { ConfigHelpEntry } from "../../shared/configHelp";

export const cliHookConfigHelp: ConfigHelpEntry[] = [
	{
		key: "cliHook.blockNpmRun",
		setter: "assist config set cliHook.blockNpmRun false",
		note: "when true (default), the hook denies 'npm run' and redirects to 'assist run'",
	},
];
