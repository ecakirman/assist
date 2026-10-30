import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

const caretSx = {
	color: "text.disabled",
	fontSize: "0.7rem",
	width: "0.7rem",
	flexShrink: 0,
} as const;

const slateCaretSx = {
	fontSize: 12,
	color: "text.secondary",
	flexShrink: 0,
} as const;

export function GroupCaret({
	collapsed,
	slate,
}: {
	collapsed: boolean;
	slate: boolean;
}) {
	if (slate) {
		const Icon = collapsed ? ChevronRight : ExpandMore;
		return <Icon sx={slateCaretSx} />;
	}
	return (
		<Typography variant="caption" sx={caretSx}>
			{collapsed ? "▸" : "▾"}
		</Typography>
	);
}
