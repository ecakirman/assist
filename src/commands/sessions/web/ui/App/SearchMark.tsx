import Box from "@mui/material/Box";
import type { ReactNode } from "react";

export function SearchMark({ children }: { children: ReactNode }) {
	return (
		<Box
			component="mark"
			sx={{
				bgcolor: "warning.main",
				color: "warning.contrastText",
				borderRadius: 0.5,
				px: 0.25,
			}}
		>
			{children}
		</Box>
	);
}
