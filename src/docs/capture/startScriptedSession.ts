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

function nodeHome(capture: CaptureHome, node: string | undefined) {
	if (!node) return capture;
	const peer = capture.peers.get(node);
	if (!peer) throw new Error(`Session on node ${node} needs a peer step first`);
	return peer.capture;
}

export async function startScriptedSession(
	capture: CaptureHome,
	step: CaptureSessionStep,
): Promise<void> {
	const target = nodeHome(capture, step.node);
	scriptFakeClaude(target.home, step);
	const { sessionId } = await requestDaemon(
		target.home,
		{
			type: "create",
			cwd: join(target.reposDir, step.repo),
			prompt: step.prompt,
		},
		"created",
	);
	if (sessionId) capture.sessionIds.set(step.prompt, sessionId);
	if (step.status && step.status !== "running")
		await requestDaemon(
			target.home,
			{ type: "set-status", sessionId, status: step.status, ack: true },
			"ack",
		);
}
