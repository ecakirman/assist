import { groupSessionsByRepo } from "../../../groupSessionsByRepo";
import type { SessionInfo } from "../../../../../useSessionSocket";
import { useStarredSessions } from "../../../../useStarredSessions";

export function useSessionGroups(
	sessions: SessionInfo[],
): ReturnType<typeof groupSessionsByRepo> {
	const { isStarred } = useStarredSessions();
	return groupSessionsByRepo(sessions, isStarred);
}
