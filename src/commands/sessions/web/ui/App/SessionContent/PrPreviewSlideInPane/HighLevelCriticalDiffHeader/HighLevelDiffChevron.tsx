import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";

export function HighLevelDiffChevron({
	path,
	collapsed,
	onToggle,
}: {
	path: string;
	collapsed: boolean;
	onToggle: () => void;
}) {
	const Chevron = collapsed ? ChevronRightIcon : ExpandMoreIcon;
	return (
		<IconButton
			size="small"
			onClick={(event) => {
				event.stopPropagation();
				onToggle();
			}}
			aria-expanded={!collapsed}
			aria-label={`${collapsed ? "Expand" : "Collapse"} ${path}`}
			sx={{ p: 0.25, flexShrink: 0 }}
		>
			<Chevron sx={{ fontSize: 16 }} />
		</IconButton>
	);
}
