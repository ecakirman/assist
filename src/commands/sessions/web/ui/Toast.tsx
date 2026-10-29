import Snackbar, { type SnackbarProps } from "@mui/material/Snackbar";
import { createPortal } from "react-dom";
import { useToastStackContext } from "./useToastStackContext";

type Props = Omit<SnackbarProps, "anchorOrigin" | "sx">;

const stackedSx = { position: "static", transform: "none" } as const;

export function Toast({ onClose, ...props }: Props) {
	const stack = useToastStackContext();
	if (!stack) {
		return (
			<Snackbar
				{...props}
				onClose={onClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			/>
		);
	}
	return createPortal(
		<Snackbar
			{...props}
			sx={stackedSx}
			onClose={(event, reason) => {
				const clickedAnotherToast =
					reason === "clickaway" &&
					event?.target instanceof Node &&
					stack.contains(event.target);
				if (!clickedAnotherToast) onClose?.(event, reason);
			}}
		/>,
		stack,
	);
}
