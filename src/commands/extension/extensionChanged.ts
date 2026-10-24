import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { bundledSources } from "./bundledSources";
import { latestUpdate } from "./latestUpdate";

const entryPoints = [
	"src/commands/extension/criteriaContentScript.ts",
	"src/commands/extension/docsFeedback/docsContentScript.ts",
	"src/commands/extension/sendToAssist/assistBackground.ts",
	"src/commands/extension/sendToAssist/assistOptions.ts",
];

function lastSignedVersion(): string | undefined {
	const updates = execFileSync(
		"git",
		["show", "origin/main:extension/updates.json"],
		{ encoding: "utf8" },
	);
	return latestUpdate(readFileSync("extension/manifest.json", "utf8"), updates)
		?.version;
}

export async function extensionChanged(): Promise<boolean> {
	const signed = lastSignedVersion();
	if (!signed) {
		console.log("No signed version recorded; signing.");
		return true;
	}
	const range = [`v${signed}`, "HEAD", "--"];
	const paths = [
		"extension",
		"src/commands/extension",
		...(await Promise.all(entryPoints.map(bundledSources))).flat(),
		":!extension/updates.json",
	];
	const { status } = spawnSync("git", ["diff", "--quiet", ...range, ...paths]);
	if (status === 0) {
		console.log(`Extension unchanged since v${signed}; skipping.`);
		return false;
	}
	if (status !== 1) throw new Error(`git diff exited with ${status}`);
	execFileSync("git", ["diff", "--stat", ...range, ...paths], {
		stdio: "inherit",
	});
	return true;
}

const changed = await extensionChanged();
if (process.env.GITHUB_OUTPUT)
	appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
