import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { GroupCaret } from "./GroupToggle/GroupCaret";
import { GroupLabel } from "./GroupToggle/GroupLabel";
import { groupToggleSx } from "./GroupToggle/groupToggleSx";

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
	const slate = useTheme().design === "slate";
	const sx = groupToggleSx(slate);
	return (
		<ButtonBase aria-expanded={!collapsed} onClick={onToggle} sx={sx.toggle}>
			<GroupCaret collapsed={collapsed} slate={slate} />
			<GroupLabel label={label} collapsed={collapsed} pinned={pinned} />
			{collapsed ? (
				collapsedSummary
			) : (
				<Typography variant="caption" sx={sx.count}>
					{count}
				</Typography>
			)}
			{sx.rule && <Box sx={sx.rule} />}
		</ButtonBase>
	);
}
