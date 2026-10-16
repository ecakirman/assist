import { useEffect, useState } from "react";
import type { HistoricalSession } from "../../../../../types";
import { fetchMatches } from "./useHistorySearch/fetchMatches";

export type HistorySearchState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "done"; sessions: HistoricalSession[] }
	| { status: "error"; message: string };

const DEBOUNCE_MS = 300;

export function useHistorySearch(
	cwd: string,
	node: string | undefined,
	rawQuery: string,
): HistorySearchState {
	const query = rawQuery.trim();
	const [state, setState] = useState<HistorySearchState>({ status: "idle" });

	useEffect(() => {
		if (!cwd || !query) {
			setState({ status: "idle" });
			return;
		}
		setState({ status: "loading" });
		const controller = new AbortController();
		const timer = setTimeout(() => {
			fetchMatches(cwd, query, node, controller.signal).then(
				(sessions) => {
					if (!controller.signal.aborted)
						setState({ status: "done", sessions });
				},
				(error: unknown) => {
					if (controller.signal.aborted) return;
					const message =
						error instanceof Error ? error.message : String(error);
					setState({ status: "error", message });
				},
			);
		}, DEBOUNCE_MS);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [cwd, node, query]);

	return state;
}
