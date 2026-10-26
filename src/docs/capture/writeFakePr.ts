import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CaptureOpenPrStep } from "../captureSetupStepSchema";
import type { CaptureHome } from "./createCaptureHome";

export function writeFakePr(
	capture: CaptureHome,
	step: CaptureOpenPrStep,
): void {
	const file = join(capture.home, ".fake-gh.json");
	const prs = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
	const { repo, ...pr } = step;
	prs[repo] = pr;
	writeFileSync(file, JSON.stringify(prs, null, 2));
}
