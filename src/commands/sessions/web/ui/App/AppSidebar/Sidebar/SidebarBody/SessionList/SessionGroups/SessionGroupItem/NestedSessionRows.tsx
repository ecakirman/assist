import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import type { NestedSessionRow } from "../../../../../../nestUnderBacklogRun";
import type { SessionInfo } from "../../../../../../../useSessionSocket";

const branchSx = {
	position: "relative",
	"&::before": {
		content: '""',
		position: "absolute",
		left: 0,
		top: "-1px",
		width: "6px",
		height: "19.5px",
		borderLeft: 1,
		borderBottom: 1,
		borderColor: "divider",
	},
	"&:not(:last-of-type)::after": {
		content: '""',
		position: "absolute",
		left: 0,
		top: 0,
		bottom: "-1px",
		borderLeft: 1,
		borderColor: "divider",
	},
} as const;

const nestedChildrenSx = { ml: "13px" } as const;

export function NestedSessionRows({
	rows,
	renderCard,
}: {
	rows: NestedSessionRow[];
	renderCard: (session: SessionInfo, nested?: SessionInfo[]) => ReactNode;
}) {
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
			renderBranch(row.session, undefined, false)
		) : (
			<Box key={row.session.id}>
				{renderBranch(row.session, row.children, false)}
				<Box sx={nestedChildrenSx}>
					{row.children.map((child) => renderBranch(child))}
				</Box>
			</Box>
		),
	);
}
