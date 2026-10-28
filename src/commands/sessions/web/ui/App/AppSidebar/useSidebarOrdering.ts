import { useCallback, useMemo } from "react";
import type { IsParkedGroup } from "./groupSessionsByRepo";
import { isStalledGroup } from "./useSidebarOrdering/isStalledGroup";
import { sortSessionsByStar } from "./useSidebarOrdering/sortSessionsByStar";
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
	isParkedGroup: IsParkedGroup;
} {
	const { isStarred } = useStarredSessions();
	const { isCollapsed, openedAt } = useCollapsedGroups();
	const { parkWaitingAfterMs } = useSessionViewConfig();
	const now = useWaitingClock();

	return {
		sessions: useMemo(
			() => sortSessionsByStar(sessions, isStarred),
			[sessions, isStarred],
		),
		isParkedGroup: useCallback(
			(key: string, members: SessionInfo[]) =>
				!isCollapsed(key, members) &&
				isStalledGroup(members, {
					now,
					thresholdMs: parkWaitingAfterMs,
					activeId,
					isStarred,
					openedAt: openedAt(key),
				}),
			[isCollapsed, openedAt, now, parkWaitingAfterMs, activeId, isStarred],
		),
	};
}
