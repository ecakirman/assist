import type { CaptureSetupStep } from "../captureSetupStepSchema";
import { runAssist } from "./runAssist";
import type { CaptureHome } from "./createCaptureHome";
import { requestDaemon } from "./requestDaemon";
import { startScriptedSession } from "./startScriptedSession";

export async function runSetupStep(
	capture: CaptureHome,
	step: CaptureSetupStep,
): Promise<void> {
	if ("assist" in step) runAssist(capture, step.assist);
	else if ("session" in step) await startScriptedSession(capture, step.session);
	else
		await requestDaemon(
			capture.home,
			{ type: "create-run", runName: step.run, cwd: capture.sandbox },
			"created",
		);
}
