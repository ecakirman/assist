import type { SessionInfo } from "../../../../types";

export function hasWaitedPastThreshold(
	session: SessionInfo,
	now: number,
	thresholdMs: number,
): boolean {
	return (
		session.status === "waiting" &&
		session.waitingSince != null &&
		now - session.waitingSince >= thresholdMs
	);
}
