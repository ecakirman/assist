import type { Session } from "./createSession";
import { daemonLog } from "./daemonLog";

export function endsStreamLife(
	session: Session,
	status: Session["status"],
	sharedWithOtherAgents: (session: Session) => boolean,
): boolean {
	if (status !== "done" || !session.worktree) return false;
	if (!sharedWithOtherAgents(session)) return true;
	daemonLog(
		`session ${session.id} done in ${session.worktree.path}: workspace kept, other agents are still working there`,
	);
	return false;
}
