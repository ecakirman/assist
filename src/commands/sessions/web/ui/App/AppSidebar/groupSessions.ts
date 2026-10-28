import type { NestedSessionRow } from "../nestUnderBacklogRun";
import type { SessionInfo } from "../../types";

export function groupSessions(rows: NestedSessionRow[]): SessionInfo[] {
	return rows.flatMap((row) => [row.session, ...row.children]);
}
