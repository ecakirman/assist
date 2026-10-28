import { flattenSessionGroups } from "./flattenSessionGroups";
import { groupSessions } from "./groupSessions";
import { groupSessionsByRepo, type IsParkedGroup } from "./groupSessionsByRepo";
import type { SessionInfo } from "../../types";

const never = () => false;

export function visibleSessionOrder(
	sessions: SessionInfo[],
	isStarred: (session: SessionInfo) => boolean,
	isGroupCollapsed: (key: string, members: SessionInfo[]) => boolean = never,
	isParkedGroup?: IsParkedGroup,
): SessionInfo[] {
	return flattenSessionGroups(
		groupSessionsByRepo(sessions, isStarred, isParkedGroup).filter(
			(group) =>
				group.kind === "single" ||
				(!group.parked &&
					!isGroupCollapsed(group.key, groupSessions(group.rows))),
		),
	);
}
