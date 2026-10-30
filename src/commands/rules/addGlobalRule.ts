import chalk from "chalk";
import { loadGlobalConfigRaw } from "../../shared/loadConfig";
import { getGlobalConfigPath } from "../../shared/loadConfigFrom";
import { applyConfigSet } from "../config/applyConfigSet";
import { globalConfigFileLabel } from "../config/globalConfigFileLabel";

function fail(message: string): void {
	console.error(chalk.red(message));
	process.exitCode = 1;
}

function existingRules(globalConfigPath: string): unknown[] {
	const advice = loadGlobalConfigRaw(globalConfigPath).advice as
		| { rules?: unknown }
		| undefined;
	return Array.isArray(advice?.rules) ? advice.rules : [];
}

export function addGlobalRule(
	text: string,
	options: { scope?: string; title?: string },
	globalConfigPath: string = getGlobalConfigPath(),
): void {
	if (options.scope !== undefined) {
		fail(
			"--global writes to ~/.assist.yml and cannot be combined with --scope",
		);
		return;
	}
	const rule = text.trim();
	const title = options.title?.trim() ?? "";
	if (rule === "" || title === "") {
		fail("Global rules need both rule text and --title");
		return;
	}

	const result = applyConfigSet(
		"advice.rules",
		[...existingRules(globalConfigPath), { title, text: rule }],
		true,
		process.cwd(),
		globalConfigPath,
	);
	if (!result.ok) {
		fail(result.errors.join("\n"));
		return;
	}
	console.log(
		`Added ${chalk.cyan(title)} to advice.rules in ${globalConfigFileLabel(globalConfigPath)}`,
	);
}
