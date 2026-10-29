import type { ReactNode } from "react";
import { useRestoreFocusAfter } from "./LoadingFieldset/useRestoreFocusAfter";

const fieldsetStyle = { border: 0, margin: 0, padding: 0, minWidth: 0 };

export function LoadingFieldset({
	loading,
	restoreFocus,
	children,
}: {
	loading: boolean;
	restoreFocus: () => void;
	children: ReactNode;
}) {
	const trackFocus = useRestoreFocusAfter(loading, restoreFocus);
	return (
		<fieldset disabled={loading} style={fieldsetStyle} onFocus={trackFocus}>
			{children}
		</fieldset>
	);
}
