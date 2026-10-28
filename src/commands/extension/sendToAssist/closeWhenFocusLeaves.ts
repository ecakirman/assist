import type { FocusEvent } from "react";

export function closeWhenFocusLeaves(
	keepOpen: boolean,
	onClose: (restoreFocus: boolean) => void,
) {
	return (event: FocusEvent<HTMLElement>) => {
		if (event.currentTarget.contains(event.relatedTarget as Node | null))
			return;
		if (document.hasFocus() && !keepOpen) onClose(false);
	};
}
