import type { KeyboardEvent } from "react";

function isCopyShortcut(event: KeyboardEvent): boolean {
	return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c";
}

export function copyWhenEmptyKeyDown(
	copyText: string | undefined,
	isEmpty: boolean,
	next: (event: KeyboardEvent) => void,
) {
	return (event: KeyboardEvent) => {
		if (copyText && isEmpty && isCopyShortcut(event)) {
			event.preventDefault();
			void navigator.clipboard?.writeText(copyText);
			return;
		}
		next(event);
	};
}
