import { flattenSessionGroups } from "./flattenSessionGroups";
import { groupSessions } from "./groupSessions";
import { groupSessionsByRepo } from "./groupSessionsByRepo";
import type { SessionInfo } from "../../types";

const never = () => false;

export function visibleSessionOrder(
	sessions: SessionInfo[],
	isStarred: (session: SessionInfo) => boolean,
	isGroupCollapsed: (key: string, members: SessionInfo[]) => boolean = never,
	minGroupSize = 2,
): SessionInfo[] {
	return flattenSessionGroups(
		groupSessionsByRepo(sessions, isStarred, minGroupSize).filter(
			(group) =>
				group.kind === "single" ||
				!isGroupCollapsed(group.key, groupSessions(group.rows)),
		),
	);
}
