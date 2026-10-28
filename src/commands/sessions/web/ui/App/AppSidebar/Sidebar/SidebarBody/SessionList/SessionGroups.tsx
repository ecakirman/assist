import { Fragment } from "react";
import { cloneBadgeSessionIds } from "./SessionGroups/cloneBadgeSessionIds";
import { flattenSessionGroups } from "../../../flattenSessionGroups";
import type { groupSessionsByRepo } from "../../../groupSessionsByRepo";
import { ParkedDivider } from "./SessionGroups/ParkedDivider";
import { ServingBanners } from "./SessionGroups/ServingBanners";
import { SessionGroupItem } from "./SessionGroups/SessionGroupItem";
import type { SessionListHandlers } from "../../../../../types";
import { CloneBadgeContext } from "../../../useCloneBadgeContext";

export function SessionGroups({
	groups,
	activeId,
	initialized,
	onSelect,
	onRetry,
	onRestart,
	onDismiss,
	onSetAutoApprove,
	onSetAutoAdvance,
}: {
	groups: ReturnType<typeof groupSessionsByRepo>;
	activeId: string | null;
	initialized: Set<string>;
	onSelect: (id: string) => void;
} & SessionListHandlers) {
	const cardProps = {
		activeId,
		initialized,
		onSelect,
		onRetry,
		onRestart,
		onDismiss,
		onSetAutoApprove,
		onSetAutoAdvance,
	};
	const allSessions = flattenSessionGroups(groups);
	const firstParked = groups.findIndex(
		(group) => group.kind === "repo" && group.parked,
	);
	return (
		<CloneBadgeContext.Provider value={cloneBadgeSessionIds(allSessions)}>
			<ServingBanners sessions={allSessions} onJump={onSelect} />
			{groups.map((group, index) => (
				<Fragment key={group.kind === "single" ? group.session.id : group.key}>
					{index === firstParked && <ParkedDivider />}
					<SessionGroupItem group={group} cardProps={cardProps} />
				</Fragment>
			))}
		</CloneBadgeContext.Provider>
	);
}
