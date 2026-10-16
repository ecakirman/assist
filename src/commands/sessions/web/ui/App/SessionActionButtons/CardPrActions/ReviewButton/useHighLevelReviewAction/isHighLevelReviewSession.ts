import { reviewTargetPr } from "../../../../reviewTargetPr";
import type { SessionInfo } from "../../../../../types";

export function isHighLevelReviewSession(
	session: SessionInfo,
	prNumber: number,
): boolean {
	return (
		session.assistArgs?.[0] === "review" &&
		session.assistArgs.includes("--high-level") &&
		reviewTargetPr(session) === prNumber
	);
}
