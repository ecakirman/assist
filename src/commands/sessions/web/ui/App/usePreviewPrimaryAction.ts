import type { ButtonBaseActions } from "@mui/material";
import { type RefCallback, useCallback, useRef } from "react";

export const previewPrimaryActionFocusEvent = "preview-primary-action-focus";

export function usePreviewPrimaryAction() {
	const action = useRef<ButtonBaseActions>(null);
	const ref = useCallback<RefCallback<HTMLButtonElement>>((button) => {
		if (!button) return;
		const focus = () => action.current?.focusVisible();
		button.addEventListener(previewPrimaryActionFocusEvent, focus);
		return () =>
			button.removeEventListener(previewPrimaryActionFocusEvent, focus);
	}, []);
	return { action, ref, "data-preview-primary-action": "" };
}
