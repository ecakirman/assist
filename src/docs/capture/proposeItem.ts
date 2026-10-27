import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CaptureBacklogItemStep } from "../captureSetupStepSchema";
import { docsPaths } from "../docsPaths";
import type { CaptureHome } from "./createCaptureHome";

export function proposeItem(
	capture: CaptureHome,
	cwd: string,
	step: CaptureBacklogItemStep,
): string {
	const payload = join(capture.home, ".backlog-item.json");
	writeFileSync(payload, JSON.stringify(step.item));
	const result = spawnSync(
		process.execPath,
		[
			docsPaths.distEntry,
			"backlog",
			"propose",
			"--json",
			payload,
			"--confirmed",
		],
		{ cwd, env: capture.env, encoding: "utf8" },
	);
	const id = result.stdout.match(/Added item (a\d+)/)?.[1];
	if (!id)
		throw new Error(
			`backlog propose for "${step.item.name}" printed no id:\n${result.stdout}${result.stderr}`,
		);
	return id;
}
