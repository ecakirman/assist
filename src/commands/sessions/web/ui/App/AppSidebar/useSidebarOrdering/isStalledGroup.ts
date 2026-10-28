import type { SessionInfo } from "../../../types";
import { hasWaitedPastThreshold } from "./isStalledGroup/hasWaitedPastThreshold";

export function isStalledGroup(
	members: SessionInfo[],
	{
		now,
		thresholdMs,
		activeId,
		isStarred,
		openedAt,
	}: {
		now: number;
		thresholdMs: number;
		activeId: string | null;
		isStarred: (session: SessionInfo) => boolean;
		openedAt: number;
	},
): boolean {
	return (
		now - openedAt >= thresholdMs &&
		members.every(
			(session) =>
				session.id !== activeId &&
				!isStarred(session) &&
				hasWaitedPastThreshold(session, now, thresholdMs),
		)
	);
}
