import { useCallback, useMemo, useSyncExternalStore } from "react";
import { groupCollapseStore } from "./useCollapsedGroups/groupCollapseStore";

type CollapsedGroups = {
	isCollapsed: (key: string) => boolean;
	openedAt: (key: string) => number;
	setCollapsed: (key: string, collapsed: boolean) => void;
};

export function useCollapsedGroups(): CollapsedGroups {
	const raw = useSyncExternalStore(
		groupCollapseStore.subscribe,
		groupCollapseStore.getRaw,
	);
	const choices = useMemo(() => groupCollapseStore.parse(raw), [raw]);
	const isCollapsed = useCallback(
		(key: string) => choices[key] === true,
		[choices],
	);
	const openedAt = useCallback(
		(key: string) => {
			const choice = choices[key];
			return typeof choice === "number" ? choice : 0;
		},
		[choices],
	);
	return useMemo(
		() => ({
			isCollapsed,
			openedAt,
			setCollapsed: (key: string, collapsed: boolean) =>
				groupCollapseStore.setChoice(key, collapsed || Date.now()),
		}),
		[isCollapsed, openedAt],
	);
}
