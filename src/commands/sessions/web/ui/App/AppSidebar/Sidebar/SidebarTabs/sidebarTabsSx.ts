import type { Theme } from "@mui/material/styles";

export const sidebarTabsSx = {
	row: {
		display: "grid",
		gridTemplateColumns: "auto minmax(0, 1fr)",
		alignItems: "center",
		gap: 0.5,
		p: 0.75,
		borderBottom: 1,
		borderColor: (t: Theme) => t.tokens.color.lineSoft,
	},
	tabs: { minHeight: 0, "& .MuiTabs-list": { gap: 0.5 } },
	tab: {
		minHeight: 30,
		minWidth: 0,
		p: "5px 8px",
		flexDirection: "row",
		alignItems: "baseline",
	},
} as const;
