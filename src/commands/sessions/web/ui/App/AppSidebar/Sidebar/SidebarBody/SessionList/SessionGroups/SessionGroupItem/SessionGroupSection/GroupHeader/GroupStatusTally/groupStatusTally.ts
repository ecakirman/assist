import {
	type DisplayStatus,
	displayStatus,
} from "../../../../../../../../../../displayStatus";
import type { SessionInfo } from "../../../../../../../../../../types";

const tallyStatuses = ["waiting", "running", "done"] as const;

type TallyEntry = { status: DisplayStatus; count: number };

export function groupStatusTally(sessions: SessionInfo[]): TallyEntry[] {
	return tallyStatuses
		.map((status) => ({
			status,
			count: sessions.filter((s) => displayStatus(s) === status).length,
		}))
		.filter((entry) => entry.count > 0);
}
