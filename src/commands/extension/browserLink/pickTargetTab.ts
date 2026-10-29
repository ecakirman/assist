export type BrowserTab = {
	id?: number;
	url?: string;
	active: boolean;
	windowId?: number;
	lastAccessed?: number;
};

function mostRecent(tabs: BrowserTab[]): BrowserTab | undefined {
	return tabs.reduce<BrowserTab | undefined>(
		(best, tab) =>
			!best || (tab.lastAccessed ?? 0) > (best.lastAccessed ?? 0) ? tab : best,
		undefined,
	);
}

export function pickTargetTab(
	tabs: BrowserTab[],
	focusedWindowId: number | undefined,
	urlSubstring?: string,
): BrowserTab | undefined {
	if (urlSubstring)
		return mostRecent(tabs.filter((tab) => tab.url?.includes(urlSubstring)));
	const active = tabs.filter((tab) => tab.active);
	return (
		active.find((tab) => tab.windowId === focusedWindowId) ?? mostRecent(active)
	);
}
