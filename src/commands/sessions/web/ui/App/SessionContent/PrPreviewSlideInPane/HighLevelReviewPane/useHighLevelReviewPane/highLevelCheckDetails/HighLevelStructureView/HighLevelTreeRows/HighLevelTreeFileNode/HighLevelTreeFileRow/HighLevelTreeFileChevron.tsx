import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function HighLevelTreeFileChevron({ open }: { open: boolean }) {
	const Chevron = open ? ExpandMoreIcon : ChevronRightIcon;
	return (
		<Chevron
			sx={{
				fontSize: 16,
				color: open ? "primary.main" : "text.secondary",
				flexShrink: 0,
			}}
		/>
	);
}
