import type { HistoryCardHandlers } from "../../../../../types";
import { HistoryCards } from "./HistoryCards";
import { HistoryNotice } from "./HistoryNotice";
import type { HistorySearchState } from "./useHistorySearch";

export function HistorySearchResults({
	search,
	viewingId,
	...handlers
}: {
	search: Exclude<HistorySearchState, { status: "idle" }>;
	viewingId?: string | null;
} & HistoryCardHandlers) {
	if (search.status === "loading")
		return <HistoryNotice>Searching…</HistoryNotice>;
	if (search.status === "error")
		return (
			<HistoryNotice color="error.main">
				Search failed: {search.message}
			</HistoryNotice>
		);
	return (
		<HistoryCards
			sessions={search.sessions}
			viewingId={viewingId}
			empty={<HistoryNotice>No sessions match</HistoryNotice>}
			{...handlers}
		/>
	);
}
