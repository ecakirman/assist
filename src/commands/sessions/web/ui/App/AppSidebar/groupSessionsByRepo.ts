import { bucketSessionsByRepoKey } from "./groupSessionsByRepo/bucketSessionsByRepoKey";
import {
	type NestedSessionRow,
	nestUnderBacklogRun,
} from "../nestUnderBacklogRun";
import type { SessionInfo } from "../../types";
import { starredThenWaitingFirst } from "./groupSessionsByRepo/starredThenWaitingFirst";

type SessionGroup =
	| { kind: "single"; session: SessionInfo }
	| {
			kind: "repo";
			key: string;
			label: string;
			rows: NestedSessionRow[];
			parked: boolean;
	  };

export type IsParkedGroup = (key: string, members: SessionInfo[]) => boolean;

const never = () => false;

export function groupSessionsByRepo(
	sessions: SessionInfo[],
	isStarred: (session: SessionInfo) => boolean,
	isFloatingWaiter: (session: SessionInfo) => boolean = never,
	isParkedGroup: IsParkedGroup = never,
): SessionGroup[] {
	const groups = bucketSessionsByRepoKey(sessions).map(
		({ key, label, members }): SessionGroup =>
			members.length < 2
				? { kind: "single", session: members[0]! }
				: {
						kind: "repo",
						key,
						label,
						rows: starredThenWaitingFirst(
							nestUnderBacklogRun(members),
							(row) => rowMembers(row).some(isStarred),
							(row) => rowMembers(row).some(isFloatingWaiter),
						),
						parked: isParkedGroup(key, members),
					},
	);
	const isParked = (group: SessionGroup) =>
		group.kind === "repo" && group.parked;
	return [
		...starredThenWaitingFirst(
			groups.filter((group) => !isParked(group)),
			(group) => groupMembers(group).some(isStarred),
			(group) => groupMembers(group).some(isFloatingWaiter),
		),
		...groups.filter(isParked),
	];
}

function rowMembers(row: NestedSessionRow): SessionInfo[] {
	return [row.session, ...row.children];
}

function groupMembers(group: SessionGroup): SessionInfo[] {
	return group.kind === "repo"
		? group.rows.flatMap(rowMembers)
		: [group.session];
}
