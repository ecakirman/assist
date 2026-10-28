import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { useCycleSessionCards } from "./CardCyclingScrollport/useCycleSessionCards";
import type { SessionInfo } from "../../../../../useSessionSocket";

const unpaddedScrollportSx = { flex: 1, overflow: "auto" } as const;

const paddedContentSx = { py: 0.5 } as const;

export function CardCyclingScrollport({
	sessions,
	onSelect,
	children,
}: {
	sessions: SessionInfo[];
	onSelect: (id: string) => void;
	children: ReactNode;
}) {
	const cycleCards = useCycleSessionCards({ sessions, onSelect });
	return (
		<Box sx={unpaddedScrollportSx} onKeyDown={cycleCards}>
			<Box sx={paddedContentSx}>{children}</Box>
		</Box>
	);
}
