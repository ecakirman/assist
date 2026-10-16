import Box from "@mui/material/Box";
import { useState } from "react";
import { FilterInput } from "../../../../FilterInput";
import {
	HistoryCards,
	type HistoryCardsProps,
} from "./HistoryList/HistoryCards";
import { HistoryNotice } from "./HistoryList/HistoryNotice";
import { HistorySearchResults } from "./HistoryList/HistorySearchResults";
import { useHistorySearch } from "./HistoryList/useHistorySearch";
import {
	repoGroupCwd,
	repoGroupKey,
	repoKeyForCwd,
} from "../../../../repoGroupKey";
import { useRepoSelectionContext } from "../../../../useRepoSelectionContext";

export function HistoryList({ sessions, ...handlers }: HistoryCardsProps) {
	const { selectedCwd, selectedNode } = useRepoSelectionContext();
	const [query, setQuery] = useState("");
	const search = useHistorySearch(selectedCwd, selectedNode, query);
	const selectedKey = repoKeyForCwd(selectedCwd, sessions);
	// why: uniqueRepos renders one row per clone even if two groups disagree on origin, so match the clone too or the suppressed group's sessions become unreachable
	const filtered = selectedCwd
		? sessions.filter(
				(s) =>
					repoGroupKey(s) === selectedKey || repoGroupCwd(s) === selectedCwd,
			)
		: [];

	return (
		<Box
			sx={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			{selectedCwd && (
				<FilterInput
					value={query}
					onChange={setQuery}
					placeholder="Search history..."
				/>
			)}
			{search.status === "idle" ? (
				<HistoryCards
					sessions={filtered}
					empty={<HistoryNotice>No history for this repo</HistoryNotice>}
					{...handlers}
				/>
			) : (
				<HistorySearchResults search={search} {...handlers} />
			)}
		</Box>
	);
}
