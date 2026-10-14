import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";
import { sessionSnapshot } from "./sessionSnapshot";

export function sendTakeoverSnapshot(
	s: Session,
	send: (data: string) => void,
): void {
	const data = sessionSnapshot(s);
	daemonLog(`session ${s.id} takeover snapshot ${data.length} chars`);
	send(data);
}
