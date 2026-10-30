import { type KeyboardEvent, useCallback } from "react";
import { adjacentSessionId } from "./useCycleSessionCards/adjacentSessionId";
import { holdSessionCardFocus } from "../../../../../holdSessionCardFocus";
import { scrollSessionCardIntoView } from "../../../../scrollSessionCardIntoView";
import { isCycleCardKey } from "../../../../../isCycleCardKey";
import type { SessionInfo } from "../../../../../../types";
import { useCollapsedGroups } from "../../../../useCollapsedGroups";
import { useStarredSessions } from "../../../../../useStarredSessions";
import { visibleSessionOrder } from "../../../../visibleSessionOrder";

export function useCycleSessionCards({
	sessions,
	onSelect,
}: {
	sessions: SessionInfo[];
	onSelect: (id: string) => void;
}): (event: KeyboardEvent) => void {
	const { isStarred } = useStarredSessions();
	const { isCollapsed } = useCollapsedGroups();
	return useCallback(
		(event: KeyboardEvent) => {
			if (!isCycleCardKey(event.nativeEvent)) return;
			const card = (event.target as Element).closest("[data-session-id]");
			if (!card) return;
			const order = visibleSessionOrder(
				sessions,
				isStarred,
				isCollapsed,
				1,
			).map((s) => s.id);
			const currentId = card.getAttribute("data-session-id");
			const id = adjacentSessionId(order, currentId, event.shiftKey ? -1 : 1);
			if (!id || id === currentId) return;
			event.preventDefault();
			onSelect(id);
			holdSessionCardFocus(id);
			scrollSessionCardIntoView(id);
		},
		[sessions, isStarred, isCollapsed, onSelect],
	);
}
