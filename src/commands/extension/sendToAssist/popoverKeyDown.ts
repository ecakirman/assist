import type { KeyboardEvent } from "react";

export function popoverKeyDown(
	onClose: (restoreFocus: boolean) => void,
	onSubmit: () => void,
) {
	return (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			event.preventDefault();
			onClose(true);
		} else if (
			event.key === "Enter" &&
			!event.shiftKey &&
			!event.nativeEvent.isComposing
		) {
			event.preventDefault();
			onSubmit();
		}
	};
}
