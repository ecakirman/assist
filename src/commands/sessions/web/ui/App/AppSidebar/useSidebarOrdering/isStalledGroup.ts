import { hasWaitedPastThreshold } from "./sortSessionsByWaiting";
import type { SessionInfo } from "../../../types";

export function isStalledGroup(
	members: SessionInfo[],
	{
		now,
		thresholdMs,
		activeId,
		isStarred,
	}: {
		now: number;
		thresholdMs: number;
		activeId: string | null;
		isStarred: (session: SessionInfo) => boolean;
	},
): boolean {
	return members.every(
		(session) =>
			session.id !== activeId &&
			!isStarred(session) &&
			hasWaitedPastThreshold(session, now, thresholdMs),
	);
}
