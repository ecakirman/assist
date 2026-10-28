import { useCallback, useMemo, useSyncExternalStore } from "react";
import { groupCollapseStore } from "./useCollapsedGroups/groupCollapseStore";

type CollapsedGroups = {
	isCollapsed: (key: string) => boolean;
	isOpened: (key: string) => boolean;
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
	const isOpened = useCallback(
		(key: string) => choices[key] === false,
		[choices],
	);
	return useMemo(
		() => ({
			isCollapsed,
			isOpened,
			setCollapsed: groupCollapseStore.setChoice,
		}),
		[isCollapsed, isOpened],
	);
}
