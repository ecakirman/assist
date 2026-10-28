import { useCallback, useMemo } from "react";
import type { IsParkedGroup } from "./groupSessionsByRepo";
import { isStalledGroup } from "./useSidebarOrdering/isStalledGroup";
import { sortSessionsByStar } from "./useSidebarOrdering/sortSessionsByStar";
import {
	hasWaitedPastThreshold,
	sortSessionsByWaiting,
} from "./useSidebarOrdering/sortSessionsByWaiting";
import type { SessionInfo } from "../../types";
import { useCollapsedGroups } from "./useCollapsedGroups";
import { useSessionViewConfig } from "./useSidebarOrdering/useSessionViewConfig";
import { useStarredSessions } from "../useStarredSessions";
import { useWaitingClock } from "./useSidebarOrdering/useWaitingClock";

export function useSidebarOrdering(
	sessions: SessionInfo[],
	activeId: string | null,
): {
	sessions: SessionInfo[];
	isFloatingWaiter: (session: SessionInfo) => boolean;
	isParkedGroup: IsParkedGroup;
} {
	const { isStarred } = useStarredSessions();
	const { isCollapsed, isOpened } = useCollapsedGroups();
	const { floatWaiting, floatWaitingAfterMs, parkWaitingAfterMs } =
		useSessionViewConfig();
	const now = useWaitingClock();

	return {
		sessions: useMemo(
			() =>
				floatWaiting
					? sortSessionsByWaiting(sessions, isStarred, now, floatWaitingAfterMs)
					: sortSessionsByStar(sessions, isStarred),
			[sessions, isStarred, floatWaiting, floatWaitingAfterMs, now],
		),
		isFloatingWaiter: useCallback(
			(session: SessionInfo) =>
				floatWaiting &&
				hasWaitedPastThreshold(session, now, floatWaitingAfterMs),
			[floatWaiting, floatWaitingAfterMs, now],
		),
		isParkedGroup: useCallback(
			(key: string, members: SessionInfo[]) =>
				!isCollapsed(key) &&
				!isOpened(key) &&
				isStalledGroup(members, {
					now,
					thresholdMs: parkWaitingAfterMs,
					activeId,
					isStarred,
				}),
			[isCollapsed, isOpened, now, parkWaitingAfterMs, activeId, isStarred],
		),
	};
}
