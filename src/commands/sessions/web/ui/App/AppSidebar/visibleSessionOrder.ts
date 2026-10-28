import { flattenSessionGroups } from "./flattenSessionGroups";
import { groupSessionsByRepo } from "./groupSessionsByRepo";
import type { SessionInfo } from "../../types";

const never = () => false;

export function visibleSessionOrder(
	sessions: SessionInfo[],
	isStarred: (session: SessionInfo) => boolean,
	isFloatingWaiter?: (session: SessionInfo) => boolean,
	isGroupCollapsed: (key: string) => boolean = never,
): SessionInfo[] {
	return flattenSessionGroups(
		groupSessionsByRepo(sessions, isStarred, isFloatingWaiter).filter(
			(group) => group.kind === "single" || !isGroupCollapsed(group.key),
		),
	);
}
