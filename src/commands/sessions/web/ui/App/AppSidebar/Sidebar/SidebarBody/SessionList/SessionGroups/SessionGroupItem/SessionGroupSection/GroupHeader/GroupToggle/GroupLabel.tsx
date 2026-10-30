import PushPinOutlined from "@mui/icons-material/PushPinOutlined";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const labelSx = {
	minWidth: 0,
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
	fontSize: 11,
	fontWeight: 600,
	lineHeight: "16px",
	letterSpacing: "0.06em",
	textTransform: "uppercase",
	color: "text.secondary",
} as const;

const pinSx = { fontSize: 14, color: "text.disabled", flexShrink: 0 } as const;

export function GroupLabel({
	label,
	pinned,
}: {
	label: string;
	pinned: boolean;
}) {
	return (
		<>
			<Typography variant="body1" title={label} sx={labelSx}>
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
