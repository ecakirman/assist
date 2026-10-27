import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CaptureGhResponse } from "../captureSetupStepSchema";
import type { CaptureHome } from "./createCaptureHome";

export function fakeGhResponsesFile(capture: CaptureHome): string {
	return join(capture.home, ".fake-gh-responses.json");
}

export function writeFakeGhResponse(
	capture: CaptureHome,
	response: CaptureGhResponse,
): void {
	const file = fakeGhResponsesFile(capture);
	const responses = existsSync(file)
		? JSON.parse(readFileSync(file, "utf8"))
		: [];
	responses.push(response);
	writeFileSync(file, JSON.stringify(responses, null, 2));
}
