import type { SessionClient } from "./broadcast";
import { daemonLog } from "./daemonLog";
import { findPortHolderPid } from "./findPortHolderPid";
import { refuseSpawn } from "./refuseSpawn";
import { startHeldSession } from "./startHeldSession";
import type { OnStatusChange, Session } from "./types";

export type PortWaitDeps = {
	sessions: Map<string, Session>;
	clients: Set<SessionClient>;
	onStatusChange: OnStatusChange;
	notify: () => void;
};

export const portWaitTiming = { pollMs: 500, timeoutMs: 30_000 };

export function awaitServerPort(
	session: Session,
	port: number,
	deps: PortWaitDeps,
): void {
	const { sessions, clients, onStatusChange, notify } = deps;
	const deadline = Date.now() + portWaitTiming.timeoutMs;
	const label = `session ${session.id} ("${session.name}")`;
	const tick = () => {
		if (!session.pendingStart || sessions.get(session.id) !== session) return;
		const holder = findPortHolderPid(port);
		if (holder === undefined) {
			daemonLog(`${label} port ${port} freed`);
			startHeldSession(
				session,
				sessions,
				clients,
				onStatusChange,
				notify,
				`port ${port} freed`,
			);
			return;
		}
		if (Date.now() < deadline) {
			setTimeout(tick, portWaitTiming.pollMs);
			return;
		}
		daemonLog(
			`${label} gave up waiting for port ${port} after ${portWaitTiming.timeoutMs}ms`,
		);
		refuseSpawn(
			session,
			new Error(`port ${port} is still held by pid ${holder}`),
			clients,
			onStatusChange,
			"relaunched",
		);
		notify();
	};
	setTimeout(tick, portWaitTiming.pollMs);
}
