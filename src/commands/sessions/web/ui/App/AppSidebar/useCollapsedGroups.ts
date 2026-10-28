import { useCallback, useMemo, useSyncExternalStore } from "react";
import { groupCollapseStore } from "./useCollapsedGroups/groupCollapseStore";

type CollapsedGroups = {
	isCollapsed: (key: string) => boolean;
	toggleCollapsed: (key: string) => void;
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
	const toggleCollapsed = useCallback(
		(key: string) => groupCollapseStore.setChoice(key, !isCollapsed(key)),
		[isCollapsed],
	);
	return useMemo(
		() => ({ isCollapsed, toggleCollapsed }),
		[isCollapsed, toggleCollapsed],
	);
}
