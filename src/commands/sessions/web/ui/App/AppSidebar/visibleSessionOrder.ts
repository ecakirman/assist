import { flattenSessionGroups } from "./flattenSessionGroups";
import { groupSessionsByRepo, type IsParkedGroup } from "./groupSessionsByRepo";
import type { SessionInfo } from "../../types";

const never = () => false;

export function visibleSessionOrder(
	sessions: SessionInfo[],
	isStarred: (session: SessionInfo) => boolean,
	isFloatingWaiter?: (session: SessionInfo) => boolean,
	isGroupCollapsed: (key: string) => boolean = never,
	isParkedGroup?: IsParkedGroup,
): SessionInfo[] {
	return flattenSessionGroups(
		groupSessionsByRepo(
			sessions,
			isStarred,
			isFloatingWaiter,
			isParkedGroup,
		).filter(
			(group) =>
				group.kind === "single" ||
				(!group.parked && !isGroupCollapsed(group.key)),
		),
	);
}
