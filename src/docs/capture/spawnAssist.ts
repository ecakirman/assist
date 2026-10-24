import { type SpawnOptions, spawn } from "node:child_process";
import { docsPaths } from "../docsPaths";
import type { CaptureHome } from "./createCaptureHome";

export function spawnAssist(
	capture: CaptureHome,
	args: string[],
	stdio: SpawnOptions["stdio"],
) {
	return spawn(process.execPath, [docsPaths.distEntry, ...args], {
		cwd: capture.sandbox,
		env: capture.env,
		stdio,
	});
}
