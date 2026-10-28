import { useCallback } from "react";
import { nextWaitingSessionId } from "./useJumpToNextWaiting/nextWaitingSessionId";
import { scrollSessionCardIntoView } from "./scrollSessionCardIntoView";
import { useCollapsedGroups } from "./useCollapsedGroups";
import type { SessionInfo, SidebarTab } from "../../types";
import { useNextWaitingHotkey } from "./useJumpToNextWaiting/useNextWaitingHotkey";
import { useStarredSessions } from "../useStarredSessions";
import { visibleSessionOrder } from "./visibleSessionOrder";

export function useJumpToNextWaiting({
	sessions,
	activeId,
	tab,
	onSelect,
	onTabChange,
	isParkedGroup,
}: {
	sessions: SessionInfo[];
	activeId: string | null;
	tab: SidebarTab;
	onSelect: (id: string) => void;
	onTabChange: (tab: SidebarTab) => void;
	isParkedGroup?: (key: string, members: SessionInfo[]) => boolean;
}): void {
	const { isStarred } = useStarredSessions();
	const { isCollapsed } = useCollapsedGroups();
	useNextWaitingHotkey(
		useCallback(() => {
			const id = nextWaitingSessionId(
				visibleSessionOrder(sessions, isStarred, isCollapsed, isParkedGroup),
				activeId,
			);
			if (!id) return;
			if (tab !== "active") onTabChange("active");
			onSelect(id);
			scrollSessionCardIntoView(id);
		}, [
			sessions,
			isStarred,
			isCollapsed,
			isParkedGroup,
			activeId,
			tab,
			onSelect,
			onTabChange,
		]),
	);
}
