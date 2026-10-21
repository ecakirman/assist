import type { Session } from "../createSession";
import type { Allocation } from "./allocateTree";
import { detectExistingWorktree } from "./detectExistingWorktree";
import { seedWorktree } from "./seedWorktree";

export function bindNewWorktree(
	session: Session | undefined,
	alloc: Allocation,
	notify: () => void,
	startHeld: (session: Session) => void = () => {},
): void {
	if (alloc.kind !== "worktree" || !alloc.cwd || !alloc.clone || !session)
		return;
	session.worktree = { path: alloc.cwd, clone: alloc.clone };
	if (alloc.created) {
		session.awaitingSeed = true;
		seedHeldSession(session, alloc.cwd, alloc.clone, notify, startHeld);
	}
	notify();
}

export function seedHeldSession(
	session: Session,
	path: string,
	clone: string,
	notify: () => void,
	startHeld: (session: Session) => void,
): void {
	seedWorktree(
		path,
		clone,
		() => {
			session.seeding = undefined;
			startHeld(session);
		},
		(installPath) => {
			session.seeding = `Installing dependencies${installPath ? ` in ${installPath}` : ""}…`;
			notify();
		},
	);
}

export function bindRestoredWorktrees(sessions: Map<string, Session>): void {
	for (const session of sessions.values()) {
		if (session.worktree || !session.cwd) continue;
		const worktree = detectExistingWorktree(session.cwd);
		if (worktree) session.worktree = worktree;
	}
}

export function bindResumedWorktree(
	session: Session | undefined,
	cwd: string,
	notify: () => void,
): void {
	if (!session) return;
	const worktree = detectExistingWorktree(cwd);
	if (!worktree) return;
	session.worktree = worktree;
	notify();
}
