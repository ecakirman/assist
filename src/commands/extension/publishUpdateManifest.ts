import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { commitOnLatestMainWithoutRebase } from "./commitOnLatestMainWithoutRebase";
import { gitOutput } from "./gitOutput";
import { latestUpdate } from "./latestUpdate";
import { supersedesUpdate } from "./supersedesUpdate";

const MANIFEST_PATH = "extension/updates.json";
const ATTEMPTS = 5;

function listedVersion(): string | undefined {
	return latestUpdate(
		readFileSync("extension/manifest.json", "utf8"),
		gitOutput(["show", `origin/main:${MANIFEST_PATH}`]),
	)?.version;
}

export function publishUpdateManifest(version: string): void {
	const blob = gitOutput([
		"hash-object",
		"-w",
		join(homedir(), ".assist/extension/updates.json"),
	]);
	const message = `chore: extension ${version} update manifest [skip ci]`;
	for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
		gitOutput(["fetch", "origin", "main"]);
		const listed = listedVersion();
		if (!supersedesUpdate(version, listed)) {
			console.log(`main already lists v${listed}; leaving it.`);
			return;
		}
		const commit = commitOnLatestMainWithoutRebase(
			MANIFEST_PATH,
			blob,
			message,
		);
		const { status } = spawnSync(
			"git",
			["push", "origin", `${commit}:refs/heads/main`],
			{ stdio: "inherit" },
		);
		if (status === 0) {
			console.log(`Published v${version} update manifest to main.`);
			return;
		}
		console.log(`Push attempt ${attempt} rejected; retrying.`);
	}
	throw new Error(`Failed to publish v${version} update manifest to main`);
}

publishUpdateManifest(
	(JSON.parse(readFileSync("package.json", "utf8")) as { version: string })
		.version,
);
