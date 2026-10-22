import Box from "@mui/material/Box";
import type { ReactNode } from "react";

export function CoveredPane({
	covered,
	children,
}: {
	covered: boolean;
	children: ReactNode;
}) {
	return (
		<Box
			aria-hidden={covered ? true : undefined}
			sx={{
				flex: 1,
				minWidth: 0,
				display: "flex",
				visibility: covered ? "hidden" : undefined,
			}}
		>
			{children}
		</Box>
	);
}
