import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { SPLIT_EASE, SPLIT_MS } from "./slideInSx";

function terminalWidth(open: boolean, full: boolean) {
	if (!open) return "100%";
	return full ? "0%" : "50%";
}

export function PrPreviewTerminalColumn({
	open,
	full,
	children,
}: {
	open: boolean;
	full: boolean;
	children: ReactNode;
}) {
	return (
		<Box
			sx={{
				display: "flex",
				width: terminalWidth(open, full),
				overflow: "hidden",
				transition: `width ${SPLIT_MS}ms ${SPLIT_EASE}`,
			}}
		>
			{children}
		</Box>
	);
}
