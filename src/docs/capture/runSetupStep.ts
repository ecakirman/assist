import type { DocsSetupStep } from "../docsPageSchema";
import { runAssist } from "./runAssist";
import type { CaptureHome } from "./createCaptureHome";
import { requestRunSession } from "./requestRunSession";

export async function runSetupStep(
	capture: CaptureHome,
	step: DocsSetupStep,
): Promise<void> {
	if ("assist" in step) runAssist(capture, step.assist);
	else await requestRunSession(capture, step.run);
}
