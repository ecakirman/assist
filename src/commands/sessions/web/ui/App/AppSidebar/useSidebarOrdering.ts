import { useMemo } from "react";
import { sortSessionsByStar } from "./useSidebarOrdering/sortSessionsByStar";
import type { SessionInfo } from "../../types";
import { useStarredSessions } from "../useStarredSessions";

export function useSidebarOrdering(sessions: SessionInfo[]): SessionInfo[] {
	const { isStarred } = useStarredSessions();
	return useMemo(
		() => sortSessionsByStar(sessions, isStarred),
		[sessions, isStarred],
	);
}
