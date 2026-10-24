import { connect } from "node:net";
import { basename, join } from "node:path";
import type { CaptureHome } from "./createCaptureHome";

const CREATE_TIMEOUT_MS = 15_000;

function daemonSocket(home: string): string {
	return process.platform === "win32"
		? String.raw`\\.\pipe\assist-sessions-daemon-${basename(home)}`
		: join(home, ".assist", "daemon", "daemon.sock");
}

function connectWhenUp(path: string, deadline: number) {
	return new Promise<ReturnType<typeof connect>>((resolve, reject) => {
		const socket = connect(path);
		socket.once("connect", () => resolve(socket));
		socket.once("error", (error) => {
			if (Date.now() > deadline) reject(error);
			else
				setTimeout(
					() => connectWhenUp(path, deadline).then(resolve, reject),
					250,
				);
		});
	});
}

export async function requestRunSession(
	capture: CaptureHome,
	runName: string,
): Promise<string> {
	const deadline = Date.now() + CREATE_TIMEOUT_MS;
	const socket = await connectWhenUp(daemonSocket(capture.home), deadline);
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			socket.destroy();
			reject(new Error(`run ${runName}: daemon did not create a session`));
		}, CREATE_TIMEOUT_MS);
		let buffer = "";
		socket.on("data", (chunk) => {
			buffer += chunk.toString();
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const message = JSON.parse(line) as {
					type?: string;
					sessionId?: string;
				};
				if (message.type !== "created" || !message.sessionId) continue;
				clearTimeout(timer);
				socket.destroy();
				resolve(message.sessionId);
			}
		});
		socket.write(
			`${JSON.stringify({ type: "create-run", runName, cwd: capture.sandbox })}\n`,
		);
	});
}
