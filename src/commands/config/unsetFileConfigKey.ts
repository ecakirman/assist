import chalk from "chalk";
import { applyConfigUnset } from "./applyConfigUnset";
import { applySharedRepoConfigUnset } from "./applySharedRepoConfigUnset";
import { exitWithConfigErrors } from "./exitWithConfigErrors";

type FileConfigTarget = {
	key: string;
	useRepo: boolean;
	repoName: string | undefined;
	global: boolean;
};

type UnsetTarget =
	| { target: "global" | "project" }
	| { target: "repo"; label: string };

export async function unsetFileConfigKey({
	key,
	useRepo,
	repoName,
	global,
}: FileConfigTarget): Promise<void> {
	const result = useRepo
		? await applySharedRepoConfigUnset(key, repoName)
		: applyConfigUnset(key, global);
	if (!result.ok) exitWithConfigErrors(result.errors);
	if (!result.removed) {
		console.log(chalk.yellow(`${key} is not set in ${whereLabel(result)}`));
		return;
	}
	console.log(chalk.green(`Unset ${key} (${targetLabel(result)})`));
}

function whereLabel(result: UnsetTarget): string {
	return result.target === "repo"
		? `repos.${result.label}`
		: `the ${result.target} config`;
}

function targetLabel(result: UnsetTarget): string {
	return result.target === "repo" ? `repo: ${result.label}` : result.target;
}
