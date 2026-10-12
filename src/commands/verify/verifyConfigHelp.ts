import type { ConfigHelpEntry } from "../../shared/configHelp";

export const verifyConfigHelp: ConfigHelpEntry[] = [
	{
		key: "blockCodeComments.ignore",
		setter: 'assist config set blockCodeComments.ignore "**/*.test.ts"',
		note: "globs exempt from the block-code-comments check",
	},
	{
		key: "hardcodedColors.ignore",
		setter: 'assist config set hardcodedColors.ignore "**/theme.ts"',
		note: "globs exempt from the hardcoded-colors check",
	},
	{
		key: "verify.roots",
		setter: "assist config set verify.roots.0 coach-tools",
		note: "monorepo package dirs whose package.json verify:* scripts run when files under them change",
	},
	{
		key: "forbiddenStrings",
		setter: 'assist config set forbiddenStrings.0.disallowed "secret"',
		note: "per-file value rules enforced by the forbidden-strings check",
	},
];
