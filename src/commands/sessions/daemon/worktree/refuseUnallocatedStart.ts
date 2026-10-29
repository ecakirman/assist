import type { Session } from "../createSession";
import { daemonLog } from "../daemonLog";

export function refuseUnallocatedStart(
	session: Session,
	path: string,
	error: unknown,
	startHeld: (session: Session) => void,
): void {
	const reason = error instanceof Error ? error.message : String(error);
	daemonLog(
		`session ${session.id} worktree ${path} could not be created: ${reason}`,
	);
	session.pendingStart = () => {
		throw new Error(`worktree ${path} could not be created: ${reason}`);
	};
	startHeld(session);
}
