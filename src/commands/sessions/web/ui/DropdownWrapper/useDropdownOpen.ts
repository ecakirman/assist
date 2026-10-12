import { type KeyboardEvent, useState } from "react";
import { isPrintableKey } from "./useDropdownOpen/isPrintableKey";

export function useDropdownOpen(typeToOpen: boolean, disabled: boolean) {
	const [open, setOpen] = useState(false);
	const [initialFilter, setInitialFilter] = useState("");

	const onKeyDown = (e: KeyboardEvent) => {
		if (!typeToOpen || open || disabled) return;
		if (!isPrintableKey(e)) return;
		e.preventDefault();
		setInitialFilter(e.key);
		setOpen(true);
	};

	const toggle = () => {
		setInitialFilter("");
		setOpen(!open);
	};

	return {
		open,
		initialFilter,
		onKeyDown,
		toggle,
		close: () => setOpen(false),
	};
}
