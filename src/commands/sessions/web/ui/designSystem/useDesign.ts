import { useState } from "react";
import type { DesignName } from "./DesignTokens";

const STORAGE_KEY = "design";

function readDesign(): DesignName {
	try {
		return localStorage.getItem(STORAGE_KEY) === "slate" ? "slate" : "classic";
	} catch {
		return "classic";
	}
}

export function useDesign() {
	const [design, setDesign] = useState<DesignName>(readDesign);
	const toggleDesign = () =>
		setDesign((prev) => {
			const next = prev === "slate" ? "classic" : "slate";
			try {
				localStorage.setItem(STORAGE_KEY, next);
			} catch {}
			return next;
		});
	return { design, toggleDesign } as const;
}
