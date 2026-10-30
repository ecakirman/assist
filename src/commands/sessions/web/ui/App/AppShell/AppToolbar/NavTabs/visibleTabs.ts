type NavTab = { path: string; label: string };

const SESSIONS: NavTab = { path: "/sessions", label: "Sessions" };
const BACKLOG: NavTab = { path: "/backlog", label: "Backlog" };
const NEXT: NavTab = { path: "/next", label: "Next" };
const RELEASES: NavTab = { path: "/releases", label: "Releases" };
const NEWS: NavTab = { path: "/news", label: "News" };
const INBOX: NavTab = { path: "/inbox", label: "Inbox" };

export function visibleTabs(
	releasesConfigured: boolean,
	newsShownInNav: boolean,
): NavTab[] {
	return [
		SESSIONS,
		BACKLOG,
		NEXT,
		...(releasesConfigured ? [RELEASES] : []),
		...(newsShownInNav ? [NEWS] : []),
		INBOX,
	];
}
