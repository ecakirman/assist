import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CaptureSessionStep } from "../captureSetupStepSchema";
import type { CaptureHome } from "./createCaptureHome";
import { requestDaemon } from "./requestDaemon";

function scriptFakeClaude(home: string, step: CaptureSessionStep): void {
	const file = join(home, ".fake-claude.json");
	const scripts = existsSync(file)
		? JSON.parse(readFileSync(file, "utf8"))
		: {};
	scripts[step.prompt] = {
		title: step.title,
		reply: step.reply,
		edits: step.edits,
	};
	writeFileSync(file, JSON.stringify(scripts, null, 2));
}

export async function startScriptedSession(
	capture: CaptureHome,
	step: CaptureSessionStep,
): Promise<void> {
	scriptFakeClaude(capture.home, step);
	const { sessionId } = await requestDaemon(
		capture.home,
		{
			type: "create",
			cwd: join(capture.reposDir, step.repo),
			prompt: step.prompt,
		},
		"created",
	);
	if (step.status && step.status !== "running")
		await requestDaemon(
			capture.home,
			{ type: "set-status", sessionId, status: step.status, ack: true },
			"ack",
		);
}
