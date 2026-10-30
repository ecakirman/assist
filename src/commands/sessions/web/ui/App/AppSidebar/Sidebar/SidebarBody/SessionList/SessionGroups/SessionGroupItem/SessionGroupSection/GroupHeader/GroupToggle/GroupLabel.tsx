import PushPinOutlined from "@mui/icons-material/PushPinOutlined";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

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

const slateLabelSx = {
	...collapsedLabelSx,
	fontSize: 11,
	fontWeight: 600,
	lineHeight: "16px",
	letterSpacing: "0.06em",
	textTransform: "uppercase",
} as const;

function labelStyle(slate: boolean, collapsed: boolean) {
	if (slate) return slateLabelSx;
	return collapsed ? collapsedLabelSx : labelSx;
}

const pinSx = { fontSize: 14, color: "text.disabled", flexShrink: 0 } as const;

export function GroupLabel({
	label,
	collapsed,
	pinned,
}: {
	label: string;
	collapsed: boolean;
	pinned: boolean;
}) {
	const slate = useTheme().design === "slate";
	return (
		<>
			<Typography
				variant="body1"
				title={label}
				sx={labelStyle(slate, collapsed)}
			>
				{label}
			</Typography>
			{pinned && (
				<Tooltip title="Collapsed by you. Stays collapsed until you open it.">
					<PushPinOutlined
						data-testid="group-pinned"
						aria-label="Collapsed by you"
						sx={pinSx}
					/>
				</Tooltip>
			)}
		</>
	);
}
