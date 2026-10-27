import chalk from "chalk";
import { isDbBackedConfigKey } from "./dbBackedConfigKeys";
import { resolveRepoUnsetTarget } from "./resolveRepoUnsetTarget";
import { unsetDbBackedConfigKey } from "./unsetDbBackedConfigKey";
import { unsetFileConfigKey } from "./unsetFileConfigKey";

type ConfigUnsetOptions = {
	global?: boolean;
	repo?: boolean | string;
};

export async function configUnset(
	key: string | undefined,
	options: ConfigUnsetOptions = {},
): Promise<void> {
	if (options.repo !== undefined && !options.global) {
		console.error(
			chalk.red(
				"--repo removes from the global config; add -g (e.g. -g --repo)",
			),
		);
		process.exit(1);
	}

	const resolved = resolveRepoUnsetTarget(key, options.repo);
	if (resolved.key === undefined) {
		console.error(chalk.red("Missing required argument 'key'"));
		process.exit(1);
		return;
	}

	if (isDbBackedConfigKey(resolved.key))
		return unsetDbBackedConfigKey(resolved.key, resolved.useRepo);
	await unsetFileConfigKey({
		key: resolved.key,
		useRepo: resolved.useRepo,
		repoName: resolved.repoName,
		global: options.global ?? false,
	});
}
