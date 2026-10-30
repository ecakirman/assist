import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

export function NewSessionFieldsLayout({
	prompt,
	children,
}: {
	prompt: ReactNode;
	children: ReactNode;
}) {
	const slate = useTheme().design === "slate";
	if (slate)
		return (
			<Stack>
				{prompt}
				<Stack spacing={1} sx={{ px: 1.5, pb: 1.5 }}>
					{children}
				</Stack>
			</Stack>
		);
	return (
		<Stack spacing={1} sx={{ p: 1 }}>
			{prompt}
			{children}
		</Stack>
	);
}
