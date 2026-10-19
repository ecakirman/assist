import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";

type HistorySearchQuery = {
	query: string;
	setQuery: (query: string) => void;
	viewedTerm: string;
	setViewedTerm: (term: string) => void;
};

const HistorySearchQueryContext = createContext<HistorySearchQuery>({
	query: "",
	setQuery: () => {},
	viewedTerm: "",
	setViewedTerm: () => {},
});

export function HistorySearchQueryProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [query, setQuery] = useState("");
	const [viewedTerm, setViewedTerm] = useState("");
	const value = useMemo(
		() => ({ query, setQuery, viewedTerm, setViewedTerm }),
		[query, viewedTerm],
	);
	return (
		<HistorySearchQueryContext.Provider value={value}>
			{children}
		</HistorySearchQueryContext.Provider>
	);
}

export function useHistorySearchQuery(): HistorySearchQuery {
	return useContext(HistorySearchQueryContext);
}

export function useTranscriptHighlightTerm(): string {
	const { query, viewedTerm } = useHistorySearchQuery();
	return query.trim() ? viewedTerm : "";
}
