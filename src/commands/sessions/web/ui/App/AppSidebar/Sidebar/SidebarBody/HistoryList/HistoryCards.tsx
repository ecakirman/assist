import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { HistoryCard } from "./HistoryCards/HistoryCard";
import type {
	HistoricalSession,
	HistoryCardHandlers,
} from "../../../../../types";

export type HistoryCardsProps = {
	sessions: HistoricalSession[];
	viewingId?: string | null;
} & HistoryCardHandlers;

export function HistoryCards({
	sessions,
	viewingId,
	onView,
	onResume,
	empty,
}: HistoryCardsProps & { empty: ReactNode }) {
	return (
		<Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
			{sessions.map((s) => (
				<HistoryCard
					key={s.sessionId}
					session={s}
					selected={s.sessionId === viewingId}
					onView={onView}
					onResume={onResume}
				/>
			))}
			{sessions.length === 0 && empty}
		</Box>
	);
}
