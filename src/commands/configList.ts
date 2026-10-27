import chalk from "chalk";
import { stringify as stringifyYaml } from "yaml";
import { describeConfigNode } from "../shared/describeConfigNode";
import { loadConfig } from "../shared/loadConfig";
import { maskConfigSecrets } from "../shared/maskConfigSecrets";
import { assistConfigSchema } from "../shared/types";
import {
	dbBackedKeysIn,
	withDbBackedConfigValues,
} from "./config/withDbBackedConfigValues";

export async function configList(): Promise<void> {
	const config = maskConfigSecrets(
		await withDbBackedConfigValues(loadConfig(), dbBackedKeysIn()),
		describeConfigNode(assistConfigSchema),
	);
	console.log(
		chalk.dim(
			"# Only the keys that are set; run assist config keys for every key and its default",
		),
	);
	console.log(stringifyYaml(config, { lineWidth: 0 }).trimEnd());
}
