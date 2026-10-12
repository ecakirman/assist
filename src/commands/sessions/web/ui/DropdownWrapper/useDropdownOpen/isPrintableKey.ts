import type { KeyboardEvent } from "react";

export function isPrintableKey(e: KeyboardEvent): boolean {
	if (e.ctrlKey || e.altKey || e.metaKey) return false;
	return e.key.length === 1 && e.key !== " ";
}
