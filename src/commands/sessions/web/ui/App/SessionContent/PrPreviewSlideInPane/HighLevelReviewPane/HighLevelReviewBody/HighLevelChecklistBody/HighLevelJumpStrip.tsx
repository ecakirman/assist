import { Box, Typography } from "@mui/material";
import type { HighLevelCheckResult } from "../../../../../../../../../review/highLevel/types";
import { usePreviewWidthContext } from "../../../../usePreviewWidthContext";
import { JUMP_STRIP_HEIGHT } from "../../../highLevelCheckDomId";
import { HighLevelJump } from "./HighLevelJumpStrip/HighLevelJump";
import { jumpToHighLevelCheck } from "./HighLevelJumpStrip/jumpToHighLevelCheck";

const stripSx = {
	position: "sticky",
	top: 0,
	zIndex: 4,
	flexShrink: 0,
	display: "flex",
	alignItems: "center",
	height: JUMP_STRIP_HEIGHT,
	px: 2,
	overflowX: "auto",
	scrollbarWidth: "none",
	"&::-webkit-scrollbar": { display: "none" },
	bgcolor: "background.paper",
	borderBottom: 1,
	borderColor: "divider",
} as const;

export function HighLevelJumpStrip({
	checks,
	ticked,
	counts,
	activeId,
}: {
	checks: HighLevelCheckResult[];
	ticked: (id: string) => boolean;
	counts: Record<string, string>;
	activeId: string | undefined;
}) {
	const { full } = usePreviewWidthContext();
	if (checks.length === 0) return null;
	return (
		<Box component="nav" aria-label="Judge" sx={stripSx}>
			{full && (
				<Typography
					variant="overline"
					sx={{ mr: 1, color: "text.secondary", letterSpacing: 1 }}
				>
					Judge
				</Typography>
			)}
			{checks.map((check) => (
				<HighLevelJump
					key={check.id}
					label={(check.kind === "manual" && check.short) || check.title}
					count={counts[check.id]}
					ticked={ticked(check.id)}
					active={check.id === activeId}
					onJump={() => jumpToHighLevelCheck(check.id)}
				/>
			))}
		</Box>
	);
}
