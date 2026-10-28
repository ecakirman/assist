import type { SessionInfo, SessionStatus } from "./types";

export type DisplayStatus = SessionStatus | "idle";

export function displayStatus(session: SessionInfo): DisplayStatus {
	if (
		session.pendingPrPreview &&
		session.pendingPrPreview.kind !== "show" &&
		session.status === "running"
	)
		return "waiting";
	return session.status;
}
