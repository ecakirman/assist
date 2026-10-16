import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export function HistoryNotice({
	children,
	color = "text.disabled",
}: {
	children: ReactNode;
	color?: string;
}) {
	return (
		<Typography
			variant="caption"
			color={color}
			role="status"
			sx={{ display: "block", textAlign: "center", p: 2 }}
		>
			{children}
		</Typography>
	);
}
