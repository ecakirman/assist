import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import type { ReactNode } from "react";
import { toolbarIconSx } from "../../designSystem/toolbarIconSx";

export function OpenInCodeTooltip({
	show,
	outlined,
	children,
}: {
	show: boolean;
	outlined: boolean;
	children: ReactNode;
}) {
	if (!show) return children;
	return (
		<Tooltip title="Open in VS Code">
			<Box component="span" sx={outlined ? toolbarIconSx : undefined}>
				{children}
			</Box>
		</Tooltip>
	);
}
