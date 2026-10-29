import { randomUUID } from "node:crypto";
import type { BrowserReply } from "../../../extension/browserLink/types";
import { relayError } from "./relayError";

type Pending<S> = {
	ws: S;
	timer: NodeJS.Timeout;
	resolve: (reply: BrowserReply) => void;
	reject: (error: Error) => void;
};

export function createPendingReplies<S>() {
	const pending = new Map<string, Pending<S>>();

	function take(id: string): Pending<S> | undefined {
		const entry = pending.get(id);
		if (!entry) return undefined;
		pending.delete(id);
		clearTimeout(entry.timer);
		return entry;
	}

	return {
		send(
			ws: S,
			timeoutMs: number,
			write: (id: string) => void,
		): Promise<BrowserReply> {
			const id = randomUUID();
			return new Promise((resolve, reject) => {
				const timer = setTimeout(() => {
					pending.delete(id);
					reject(
						relayError(
							`the assist extension did not reply within ${timeoutMs / 1000}s`,
							504,
						),
					);
				}, timeoutMs);
				pending.set(id, { ws, timer, resolve, reject });
				write(id);
			});
		},
		settle(id: string, reply: BrowserReply): void {
			take(id)?.resolve(reply);
		},
		dropSocket(ws: S): void {
			for (const [id, entry] of pending) {
				if (entry.ws !== ws) continue;
				take(id)?.reject(
					relayError("the assist extension disconnected before replying", 502),
				);
			}
		},
	};
}
