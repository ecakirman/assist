import { connectWhenUp } from "./connectWhenUp";
import { daemonSocket } from "./daemonSocket";

const REQUEST_TIMEOUT_MS = 15_000;

type DaemonReply = { type?: string; sessionId?: string; message?: string };

export async function requestDaemon(
	home: string,
	message: Record<string, unknown>,
	replyType: string,
): Promise<DaemonReply> {
	const deadline = Date.now() + REQUEST_TIMEOUT_MS;
	const socket = await connectWhenUp(daemonSocket(home), deadline);
	return new Promise((resolve, reject) => {
		const finish = (settle: () => void) => {
			clearTimeout(timer);
			socket.destroy();
			settle();
		};
		const timer = setTimeout(
			() =>
				finish(() =>
					reject(new Error(`daemon did not answer ${message.type}`)),
				),
			REQUEST_TIMEOUT_MS,
		);
		let buffer = "";
		socket.on("data", (chunk) => {
			buffer += chunk.toString();
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const reply = JSON.parse(line) as DaemonReply;
				if (reply.type === "error")
					finish(() =>
						reject(new Error(`${message.type}: ${reply.message ?? "failed"}`)),
					);
				else if (reply.type === replyType) finish(() => resolve(reply));
			}
		});
		socket.write(`${JSON.stringify(message)}\n`);
	});
}
