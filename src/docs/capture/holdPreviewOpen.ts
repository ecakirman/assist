import { randomUUID } from "node:crypto";
import type { PrPreview } from "../../commands/sessions/shared/SessionInfoBase";
import { connectWhenUp } from "./connectWhenUp";
import type { CaptureHome } from "./createCaptureHome";
import { daemonSocket } from "./daemonSocket";

const CONNECT_TIMEOUT_MS = 15_000;
const SETTLE_MS = 500;

export type CapturePreview = Omit<PrPreview, "requestId">;

function sessionIdFor(capture: CaptureHome, prompt: string): string {
	const id = capture.sessionIds.get(prompt);
	if (!id) throw new Error(`No capture session was started for "${prompt}"`);
	return id;
}

export async function holdPreviewOpen(
	capture: CaptureHome,
	session: string,
	preview: CapturePreview,
): Promise<void> {
	const sessionId = sessionIdFor(capture, session);
	const socket = await connectWhenUp(
		daemonSocket(capture.home),
		Date.now() + CONNECT_TIMEOUT_MS,
	);
	capture.openPreviews.push(socket);
	await new Promise<void>((resolve, reject) => {
		const timer = setTimeout(resolve, SETTLE_MS);
		socket.on("data", (chunk) => {
			for (const line of chunk.toString().split("\n")) {
				if (!line.includes('"error"')) continue;
				clearTimeout(timer);
				reject(new Error(`pr-preview: ${line}`));
			}
		});
		socket.write(
			`${JSON.stringify({ type: "pr-preview", sessionId, requestId: randomUUID(), ...preview })}\n`,
		);
	});
}
