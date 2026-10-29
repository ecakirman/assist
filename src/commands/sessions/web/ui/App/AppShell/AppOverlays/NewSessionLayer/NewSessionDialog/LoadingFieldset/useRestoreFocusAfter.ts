import { type FocusEvent, useEffect, useRef } from "react";

export function useRestoreFocusAfter(pending: boolean, fallback: () => void) {
	const wasPending = useRef(pending);
	const lastFocused = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (wasPending.current && !pending) {
			const target = lastFocused.current;
			if (target?.isConnected) target.focus();
			else fallback();
		}
		wasPending.current = pending;
	}, [pending, fallback]);

	return (e: FocusEvent<HTMLElement>) => {
		lastFocused.current = e.target;
	};
}
