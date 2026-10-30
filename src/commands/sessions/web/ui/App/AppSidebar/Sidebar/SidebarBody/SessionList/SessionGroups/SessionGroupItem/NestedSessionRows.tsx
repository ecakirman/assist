import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { NestedSessionRow } from "../../../../../../nestUnderBacklogRun";
import type { SessionInfo } from "../../../../../../../useSessionSocket";

const branchSx = {
	position: "relative",
	"&::before": {
		content: '""',
		position: "absolute",
		left: 0,
		top: "15px",
		width: "7px",
		height: "1px",
		bgcolor: "divider",
	},
} as const;

const nestedChildrenSx = {
	ml: "13px",
	borderLeft: 1,
	borderColor: "divider",
} as const;

export function NestedSessionRows({
	rows,
	renderCard,
}: {
	rows: NestedSessionRow[];
	renderCard: (session: SessionInfo, nested?: SessionInfo[]) => ReactNode;
}) {
	const railless = useTheme().design === "slate";
	const renderBranch = (
		session: SessionInfo,
		nested?: SessionInfo[],
		tick = true,
	) => (
		<Box key={session.id} sx={tick ? branchSx : undefined}>
			{renderCard(session, nested)}
		</Box>
	);
	return rows.map((row) =>
		row.children.length === 0 ? (
			renderBranch(row.session, undefined, !railless)
		) : (
			<Box key={row.session.id}>
				{renderBranch(row.session, row.children, !railless)}
				<Box sx={nestedChildrenSx}>
					{row.children.map((child) => renderBranch(child))}
				</Box>
			</Box>
		),
	);
}
