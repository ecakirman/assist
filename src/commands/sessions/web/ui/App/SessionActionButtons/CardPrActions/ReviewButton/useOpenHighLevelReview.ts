import { useTheme } from "@mui/material/styles";
import type { PrSummary } from "../../../../../prList";
import type { SessionInfo } from "../../../../types";
import { useSessionLaunchContext } from "../../../../useSessionLaunchContext";
import { sessionRegion } from "../../../sessionRegion";
import { focusRegion } from "../../../focusRegion";
import { hasPendingHighLevelReview } from "./useOpenHighLevelReview/hasPendingHighLevelReview";

export function useOpenHighLevelReview(
	session: SessionInfo | undefined,
	pr: PrSummary,
): (() => void) | undefined {
	const { activateSession } = useSessionLaunchContext();
	const ringColor = useTheme().palette.primary.main;
	if (!session || !hasPendingHighLevelReview(session, pr.number))
		return undefined;
	return () => {
		activateSession(session.id);
		focusRegion(sessionRegion("preview", session.id), ringColor);
	};
}
