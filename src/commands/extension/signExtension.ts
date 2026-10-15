import { rm } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import chalk from "chalk";
import packageJson from "../../../package.json";
import { spawnInherit } from "../../shared/spawnInherit";
import { copySignedXpi } from "./copySignedXpi";
import { extensionDir } from "./extensionDir";
import { findSignedXpi } from "./findSignedXpi";
import { signedAddonInstallPath } from "./signedAddonInstallPath";
import { signPreflightProblem } from "./signPreflightProblem";
import { stageExtension } from "./stageExtension";
import { writeUpdateManifest } from "./writeUpdateManifest";

const ARTIFACTS_DIR = join(homedir(), ".assist", "extension");
const STAGING_DIR = join(tmpdir(), "assist-extension");

export async function signExtension(): Promise<void> {
	const source = extensionDir();
	const problem = signPreflightProblem(source);
	if (problem) {
		console.log(chalk.red(problem.message));
		console.log(chalk.dim(problem.hint));
		process.exitCode = 1;
		return;
	}

	const { version } = packageJson;
	await stageExtension(source, STAGING_DIR, version);
	await rm(ARTIFACTS_DIR, { recursive: true, force: true });
	console.log(chalk.bold(`signing version ${version} for self-distribution`));

	const { done } = spawnInherit("npx", [
		"--yes",
		"web-ext",
		"sign",
		`--source-dir=${STAGING_DIR}`,
		`--artifacts-dir=${ARTIFACTS_DIR}`,
		"--channel=unlisted",
	]);
	if ((await done) !== 0) {
		console.log(chalk.red("web-ext sign failed"));
		process.exitCode = 1;
		return;
	}

	const xpi = await findSignedXpi(ARTIFACTS_DIR);
	if (!xpi) {
		console.log(chalk.red(`web-ext wrote no .xpi into ${ARTIFACTS_DIR}`));
		process.exitCode = 1;
		return;
	}
	await writeUpdateManifest(source, ARTIFACTS_DIR, version);
	const path = await signedAddonInstallPath(
		await copySignedXpi(xpi, ARTIFACTS_DIR),
	);
	console.log(chalk.dim(`install the signed add-on from ${path}`));
}
