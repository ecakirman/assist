import type { TransitionEvent } from "react";

export function exitOnSlideOut(open: boolean, onExited: () => void) {
	return (e: TransitionEvent<HTMLDivElement>) => {
		if (!open && e.propertyName === "transform" && e.target === e.currentTarget)
			onExited();
	};
}
