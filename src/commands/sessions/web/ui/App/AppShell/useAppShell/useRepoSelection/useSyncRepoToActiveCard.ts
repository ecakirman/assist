import { useEffect } from "react";
import { deriveActiveCwd } from "../../../../deriveActiveCwd";
import { findActiveSession } from "../../../../findActiveSession";
import type { HistoricalSession, SessionInfo } from "../../../../types";
import { LOCAL_NODE } from "./mergeRepos";

export function useSyncRepoToActiveCard(
	activeId: string | null,
	sessions: SessionInfo[],
	history: HistoricalSession[],
	setSelectedCwd: (cwd: string, node?: string, origin?: string) => void,
): void {
	const activeCwd = deriveActiveCwd(activeId, sessions, history);
	const active = findActiveSession(activeId, sessions, history);
	const activeNode = active?.node ?? LOCAL_NODE;
	const activeOrigin = active?.repoGroup?.origin;
	useEffect(() => {
		if (activeCwd) setSelectedCwd(activeCwd, activeNode, activeOrigin);
	}, [activeCwd, activeNode, activeOrigin, setSelectedCwd]);
}
