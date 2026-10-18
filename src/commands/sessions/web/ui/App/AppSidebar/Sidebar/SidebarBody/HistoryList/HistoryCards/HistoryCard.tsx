import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import { cardSx } from "../../cardSx";
import { HistoryCardChips } from "./HistoryCard/HistoryCardChips";
import { HistoryCardFooter } from "./HistoryCard/HistoryCardFooter";
import { HistoryCardSnippet } from "./HistoryCard/HistoryCardSnippet";
import { HistoryCardHeading } from "./HistoryCard/HistoryCardHeading";
import { StopCardActivation } from "../../../../../../StopCardActivation";
import type {
	HistoricalSession,
	HistoryCardHandlers,
} from "../../../../../../types";
import { ApiNodeContext } from "../../../../../../useApiNode";

function ResumeButton({ onResume }: { onResume: () => void }) {
	return (
		<IconButton
			size="small"
			onClick={(e) => {
				e.stopPropagation();
				onResume();
			}}
			title="Resume"
			sx={{ color: "text.disabled", "&:hover": { color: "text.primary" } }}
		>
			<PlayArrowIcon sx={{ fontSize: 14 }} />
		</IconButton>
	);
}

export function HistoryCard({
	session,
	selected = false,
	onView,
	onResume,
}: { session: HistoricalSession; selected?: boolean } & HistoryCardHandlers) {
	return (
		<ApiNodeContext.Provider value={session.node}>
			<ButtonBase
				onClick={() => onView(session)}
				sx={cardSx(selected)}
				aria-current={selected || undefined}
			>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<HistoryCardChips session={session} />
						<Box sx={{ flex: 1 }} />
						<StopCardActivation>
							<ResumeButton onResume={() => onResume(session)} />
						</StopCardActivation>
					</Box>
					<HistoryCardHeading session={session} />
					{session.snippet && <HistoryCardSnippet snippet={session.snippet} />}
					<HistoryCardFooter session={session} />
				</Box>
			</ButtonBase>
		</ApiNodeContext.Provider>
	);
}
