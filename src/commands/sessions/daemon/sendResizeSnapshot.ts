import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";
import { sessionSnapshot } from "./sessionSnapshot";

export function sendResizeSnapshot(
	s: Session,
	send: (data: string) => void,
): void {
	const data = sessionSnapshot(s);
	daemonLog(`session ${s.id} resize snapshot ${data.length} chars`);
	send(data);
}
