import { useCallback, useMemo, useSyncExternalStore } from "react";
import { groupCollapseStore } from "./useCollapsedGroups/groupCollapseStore";
import type { SessionInfo } from "../../types";

type CollapsedGroups = {
	isCollapsed: (key: string, members: SessionInfo[]) => boolean;
	setCollapsed: (key: string, collapsed: boolean) => void;
};

export function useCollapsedGroups(): CollapsedGroups {
	const raw = useSyncExternalStore(
		groupCollapseStore.subscribe,
		groupCollapseStore.getRaw,
	);
	const choices = useMemo(() => groupCollapseStore.parse(raw), [raw]);
	const isCollapsed = useCallback(
		(key: string, members: SessionInfo[]) => {
			const choice = choices[key];
			return (
				choice !== undefined &&
				"collapsedAt" in choice &&
				members.every((session) => session.startedAt <= choice.collapsedAt)
			);
		},
		[choices],
	);
	return useMemo(
		() => ({
			isCollapsed,
			setCollapsed: (key: string, collapsed: boolean) =>
				groupCollapseStore.setChoice(
					key,
					collapsed ? { collapsedAt: Date.now() } : { openedAt: Date.now() },
				),
		}),
		[isCollapsed],
	);
}
