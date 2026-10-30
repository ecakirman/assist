import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";

const caretSx = {
	fontSize: 12,
	color: "text.secondary",
	flexShrink: 0,
} as const;

export function GroupCaret({ collapsed }: { collapsed: boolean }) {
	const Icon = collapsed ? ChevronRight : ExpandMore;
	return <Icon sx={caretSx} />;
}
