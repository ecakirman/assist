import type { CaptureSetupStep } from "../captureSetupStepSchema";
import { linkPeer } from "./linkPeer";
import { runAssist } from "./runAssist";
import type { CaptureHome } from "./createCaptureHome";
import { requestDaemon } from "./requestDaemon";
import { startScriptedSession } from "./startScriptedSession";
import { writeFakePr } from "./writeFakePr";
import { writeTranscript } from "./writeTranscript";
import { openPreviewStep } from "./openPreviewStep";

export async function runSetupStep(
	capture: CaptureHome,
	step: CaptureSetupStep,
): Promise<void> {
	if (await openPreviewStep(capture, step)) return;
	if ("assist" in step) runAssist(capture, step.assist);
	else if ("session" in step) await startScriptedSession(capture, step.session);
	else if ("transcript" in step) writeTranscript(capture, step.transcript);
	else if ("openPr" in step) writeFakePr(capture, step.openPr);
	else if ("peer" in step) await linkPeer(capture, step.peer);
	else if ("run" in step)
		await requestDaemon(
			capture.home,
			{ type: "create-run", runName: step.run, cwd: capture.sandbox },
			"created",
		);
}
