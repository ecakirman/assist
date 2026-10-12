import { type Dispatch, type SetStateAction, useCallback } from "react";
import { savePersistedScreenshots } from "./loadPersistedScreenshots";
import type { LocalScreenshot, ScreenshotLabel } from "./useScreenshots";

export function useUpdateScreenshot(
	scope: string | undefined,
	setScreenshots: Dispatch<SetStateAction<LocalScreenshot[]>>,
) {
	return useCallback(
		(id: number, patch: ScreenshotLabel) => {
			setScreenshots((ss) => {
				const next = ss.map((s) => (s.id === id ? { ...s, ...patch } : s));
				savePersistedScreenshots(scope, next);
				return next;
			});
		},
		[scope, setScreenshots],
	);
}
