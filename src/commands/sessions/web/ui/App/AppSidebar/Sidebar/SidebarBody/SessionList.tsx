import { CardCyclingScrollport } from "./SessionList/CardCyclingScrollport";
import { NoSessionsMessage } from "./SessionList/NoSessionsMessage";
import type { PendingLaunch } from "../../../../PendingLaunch";
import { PendingLaunchCard } from "./SessionList/PendingLaunchCard";
import { SessionGroups } from "./SessionList/SessionGroups";
import type { SessionListHandlers } from "../../../../types";
import type { SessionInfo } from "../../../../useSessionSocket";
import { useSessionGroups } from "./SessionList/useSessionGroups";

export function SessionList({
	sessions,
	pendingLaunches,
	onDismissPending,
	isParkedGroup,
	...cardProps
}: {
	sessions: SessionInfo[];
	pendingLaunches: PendingLaunch[];
	activeId: string | null;
	initialized: Set<string>;
	onSelect: (id: string) => void;
	onDismissPending: (id: string) => void;
	isParkedGroup?: (key: string, members: SessionInfo[]) => boolean;
} & SessionListHandlers) {
	const groups = useSessionGroups(sessions, isParkedGroup);

	return (
		<CardCyclingScrollport
			sessions={sessions}
			onSelect={cardProps.onSelect}
			isParkedGroup={isParkedGroup}
		>
			{pendingLaunches.map((launch) => (
				<PendingLaunchCard
					key={launch.id}
					launch={launch}
					onDismiss={onDismissPending}
				/>
			))}
			<SessionGroups groups={groups} {...cardProps} />
			{sessions.length === 0 && pendingLaunches.length === 0 && (
				<NoSessionsMessage />
			)}
		</CardCyclingScrollport>
	);
}
