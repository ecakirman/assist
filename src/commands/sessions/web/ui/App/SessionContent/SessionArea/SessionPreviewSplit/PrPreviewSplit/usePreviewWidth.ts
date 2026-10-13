import { useMemo, useState } from "react";
import type { PrPreview } from "../../../../../../../shared/SessionInfoBase";
import type { DiffPanelMode } from "../../../../toggleDiffPanel";

export function usePreviewWidth(rendered: PrPreview | null) {
	const [mode, setMode] = useState<DiffPanelMode>("half");
	const full = mode === "full" && rendered?.kind === "high-level-review";
	return useMemo(
		() => ({
			mode,
			full,
			onToggleMode: () => setMode(full ? "half" : "full"),
		}),
		[mode, full],
	);
}
