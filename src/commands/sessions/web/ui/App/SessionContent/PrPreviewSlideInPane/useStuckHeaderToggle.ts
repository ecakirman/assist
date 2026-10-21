import { useRef } from "react";
import { scrollStuckHeaderIntoView } from "./useStuckHeaderToggle/scrollStuckHeaderIntoView";

export function useStuckHeaderToggle(open: boolean, onToggle: () => void) {
	const ref = useRef<HTMLDivElement>(null);
	const toggle = () => {
		if (open && ref.current) scrollStuckHeaderIntoView(ref.current);
		onToggle();
	};
	return { ref, toggle };
}
