import { spawnSync } from "node:child_process";
import { docsPaths } from "../docsPaths";
import type { CaptureHome } from "./createCaptureHome";

export function runAssist(
	capture: CaptureHome,
	args: string[],
	cwd: string = capture.sandbox,
): void {
	const result = spawnSync(process.execPath, [docsPaths.distEntry, ...args], {
		cwd,
		env: capture.env,
		stdio: "inherit",
	});
	if (result.status !== 0)
		throw new Error(`assist ${args.join(" ")} exited ${result.status}`);
}
