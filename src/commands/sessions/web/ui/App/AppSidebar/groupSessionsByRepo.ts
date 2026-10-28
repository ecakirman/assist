import { bucketSessionsByRepoKey } from "./groupSessionsByRepo/bucketSessionsByRepoKey";
import {
	type NestedSessionRow,
	nestUnderBacklogRun,
} from "../nestUnderBacklogRun";
import type { SessionInfo } from "../../types";
import { starredFirst } from "./groupSessionsByRepo/starredFirst";

type SessionGroup =
	| { kind: "single"; session: SessionInfo }
	| {
			kind: "repo";
			key: string;
			label: string;
			rows: NestedSessionRow[];
	  };

export function groupSessionsByRepo(
	sessions: SessionInfo[],
	isStarred: (session: SessionInfo) => boolean,
): SessionGroup[] {
	const groups = bucketSessionsByRepoKey(sessions).map(
		({ key, label, members }): SessionGroup =>
			members.length < 2
				? { kind: "single", session: members[0]! }
				: {
						kind: "repo",
						key,
						label,
						rows: starredFirst(nestUnderBacklogRun(members), (row) =>
							rowMembers(row).some(isStarred),
						),
					},
	);
	return starredFirst(groups, (group) => groupMembers(group).some(isStarred));
}

function rowMembers(row: NestedSessionRow): SessionInfo[] {
	return [row.session, ...row.children];
}

function groupMembers(group: SessionGroup): SessionInfo[] {
	return group.kind === "repo"
		? group.rows.flatMap(rowMembers)
		: [group.session];
}
