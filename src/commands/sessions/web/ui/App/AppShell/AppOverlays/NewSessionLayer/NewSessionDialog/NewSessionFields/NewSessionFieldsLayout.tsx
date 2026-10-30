import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

export function NewSessionFieldsLayout({
	prompt,
	children,
}: {
	prompt: ReactNode;
	children: ReactNode;
}) {
	return (
		<Stack>
			{prompt}
			<Stack spacing={1} sx={{ px: 1.5, pb: 1.5 }}>
				{children}
			</Stack>
		</Stack>
	);
}
