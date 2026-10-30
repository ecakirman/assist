import type { Theme } from "@mui/material/styles";
import type { DesignName } from "../../../../designSystem/DesignTokens";

const classic = {
	row: {
		display: "flex",
		alignItems: "center",
		minHeight: 36,
		borderBottom: 1,
		borderColor: "divider",
	},
	tabs: { flex: 1, minWidth: 0, minHeight: 36 },
	tab: { minHeight: 36, py: 0, fontSize: 12 },
} as const;

const slate = {
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
	tab: { minHeight: 30, minWidth: 0, p: "5px 8px" },
} as const;

export const sidebarTabsSx = (design: DesignName | undefined) =>
	design === "slate" ? slate : classic;
