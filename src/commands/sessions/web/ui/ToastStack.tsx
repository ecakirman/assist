import Box from "@mui/material/Box";
import { type ReactNode, useState } from "react";
import { ToastStackContext } from "./useToastStackContext";

const MAX_VISIBLE_TOASTS = 5;

export function ToastStack({ children }: { children: ReactNode }) {
	const [container, setContainer] = useState<HTMLElement | null>(null);
	return (
		<ToastStackContext.Provider value={container}>
			{children}
			<Box
				ref={setContainer}
				data-testid="toast-stack"
				sx={{
					position: "fixed",
					zIndex: "snackbar",
					bottom: { xs: 1, sm: 3 },
					left: { xs: 1, sm: "50%" },
					right: { xs: 1, sm: "auto" },
					transform: { sm: "translateX(-50%)" },
					display: "flex",
					flexDirection: "column",
					alignItems: { xs: "stretch", sm: "center" },
					gap: 1,
					pointerEvents: "none",
					"& > *": { pointerEvents: "auto" },
					[`& > :nth-last-of-type(n+${MAX_VISIBLE_TOASTS + 1})`]: {
						display: "none",
					},
				}}
			/>
		</ToastStackContext.Provider>
	);
}
