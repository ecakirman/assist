import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { GroupCaret } from "./GroupToggle/GroupCaret";
import { GroupLabel } from "./GroupToggle/GroupLabel";
import { groupToggleSx as sx } from "./GroupToggle/groupToggleSx";

export function GroupToggle({
	label,
	count,
	collapsedSummary,
	collapsed,
	pinned,
	onToggle,
}: {
	label: string;
	count: number;
	collapsedSummary: ReactNode;
	collapsed: boolean;
	pinned: boolean;
	onToggle: () => void;
}) {
	return (
		<ButtonBase aria-expanded={!collapsed} onClick={onToggle} sx={sx.toggle}>
			<GroupCaret collapsed={collapsed} />
			<GroupLabel label={label} pinned={pinned} />
			{collapsed ? (
				collapsedSummary
			) : (
				<Typography variant="caption" sx={sx.count}>
					{count}
				</Typography>
			)}
		</ButtonBase>
	);
}
