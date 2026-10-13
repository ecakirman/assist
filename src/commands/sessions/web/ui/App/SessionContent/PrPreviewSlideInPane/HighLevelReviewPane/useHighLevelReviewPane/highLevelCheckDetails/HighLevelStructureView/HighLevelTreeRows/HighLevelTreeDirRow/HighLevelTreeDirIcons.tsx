import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

export function HighLevelTreeDirIcons({ collapsed }: { collapsed: boolean }) {
	const Chevron = collapsed ? ChevronRightIcon : ExpandMoreIcon;
	const Folder = collapsed ? FolderIcon : FolderOpenIcon;
	return (
		<>
			<Chevron sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }} />
			<Folder
				sx={{
					fontSize: 16,
					color: collapsed ? "primary.main" : "text.secondary",
					flexShrink: 0,
				}}
			/>
		</>
	);
}
