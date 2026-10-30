import ViewSidebarOutlined from "@mui/icons-material/ViewSidebarOutlined";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

const smallIconSx = { fontSize: 16 } as const;

export function SidebarCollapseToggle({
	collapsed,
	onToggleCollapsed,
	size = "medium",
}: {
	collapsed: boolean;
	onToggleCollapsed: () => void;
	size?: "small" | "medium";
}) {
	const label = collapsed ? "Show sidebar" : "Hide sidebar";
	const slate = useTheme().design === "slate";
	const expandedColor = slate ? "text.secondary" : "text.primary";

	return (
		<IconButton
			size={slate ? "medium" : size}
			onClick={onToggleCollapsed}
			title={label}
			aria-label={label}
			aria-pressed={!collapsed}
			sx={{
				color: collapsed ? "text.disabled" : expandedColor,
				"&:hover": { color: "text.primary" },
			}}
		>
			<ViewSidebarOutlined sx={size === "small" ? smallIconSx : undefined} />
		</IconButton>
	);
}
