import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

const toggleSx = {
	flex: 1,
	minWidth: 0,
	display: "flex",
	alignItems: "center",
	gap: 1,
	justifyContent: "flex-start",
	textAlign: "left",
	borderRadius: 0.5,
	"&:focus-visible": { outline: 1, outlineColor: "primary.main" },
} as const;

const labelSx = {
	minWidth: 0,
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
	fontSize: "1rem",
	fontWeight: 500,
	color: "text.primary",
} as const;

const collapsedLabelSx = { ...labelSx, color: "text.secondary" } as const;

const caretSx = {
	color: "text.disabled",
	fontSize: "0.7rem",
	width: "0.7rem",
	flexShrink: 0,
} as const;

const countSx = {
	color: "text.disabled",
	fontVariantNumeric: "tabular-nums",
} as const;

const ruleSx = {
	flex: 1,
	minWidth: 8,
	height: "1px",
	bgcolor: "divider",
} as const;

export function GroupToggle({
	label,
	count,
	collapsedSummary,
	collapsed,
	onToggle,
}: {
	label: string;
	count: number;
	collapsedSummary: ReactNode;
	collapsed: boolean;
	onToggle: () => void;
}) {
	return (
		<ButtonBase aria-expanded={!collapsed} onClick={onToggle} sx={toggleSx}>
			<Typography variant="caption" sx={caretSx}>
				{collapsed ? "▸" : "▾"}
			</Typography>
			<Typography
				variant="body1"
				title={label}
				sx={collapsed ? collapsedLabelSx : labelSx}
			>
				{label}
			</Typography>
			{collapsed ? (
				collapsedSummary
			) : (
				<Typography variant="caption" sx={countSx}>
					{count}
				</Typography>
			)}
			<Box sx={ruleSx} />
		</ButtonBase>
	);
}
