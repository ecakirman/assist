import { type SessionClient, sendTo } from "./broadcast";
import { daemonLog } from "./daemonLog";
import type { SessionManager } from "./SessionManager";

type Msg = Record<string, unknown>;
type Handler = (
	client: SessionClient,
	manager: SessionManager,
	data: Msg,
) => void;
type SpawnResult = string | { error: string };

export function creator(
	isNew: boolean,
	spawn: (m: SessionManager, d: Msg) => SpawnResult | Promise<SpawnResult>,
): Handler {
	const reply = (client: SessionClient, result: SpawnResult) => {
		if (typeof result !== "string") {
			sendTo(client, { type: "error", message: result.error });
			return;
		}
		sendTo(client, { type: "created", sessionId: result, isNew });
	};
	return (client, m, d) => {
		if (m.links.route(client, d)) return;
		const result = spawn(m, d);
		if (result instanceof Promise)
			result.then(
				(resolved) => reply(client, resolved),
				(error: unknown) => {
					const reason = error instanceof Error ? error.message : String(error);
					daemonLog(`${d.type} failed: ${reason}`);
					reply(client, { error: `${d.type} failed: ${reason}` });
				},
			);
		else reply(client, result);
	};
}
