import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SidebarCollapseToggle } from "../../SidebarCollapseToggle";
import type { SidebarTab } from "../../../types";
import { useSidebarCollapsedContext } from "../../useSidebarCollapsedContext";
import { sidebarTabsSx } from "./SidebarTabs/sidebarTabsSx";
import { SidebarTabLabel } from "./SidebarTabs/SidebarTabLabel";

export function SidebarTabs({
	tab,
	activeCount,
	historyCount,
	onChange,
}: {
	tab: SidebarTab;
	activeCount: number;
	historyCount: number;
	onChange: (tab: SidebarTab) => void;
}) {
	const { collapsed, onToggleCollapsed } = useSidebarCollapsedContext();
	const sx = sidebarTabsSx(useTheme().design);
	const tabIndex = tab === "active" ? 0 : 1;
	return (
		<Box sx={sx.row}>
			<SidebarCollapseToggle
				collapsed={collapsed}
				onToggleCollapsed={onToggleCollapsed}
				size="small"
			/>
			<Tabs
				value={tabIndex}
				onChange={(_e, v: number) => onChange(v === 0 ? "active" : "history")}
				variant="fullWidth"
				sx={sx.tabs}
			>
				<Tab
					label={<SidebarTabLabel label="Active" count={activeCount} />}
					sx={sx.tab}
				/>
				<Tab
					label={<SidebarTabLabel label="History" count={historyCount} />}
					sx={sx.tab}
				/>
			</Tabs>
		</Box>
	);
}
