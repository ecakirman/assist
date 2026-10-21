import type { ReactNode } from "react";
import { renderInShadow } from "../renderInShadow";
import { mountHost } from "./mountHost";

let open: { anchor: HTMLElement; close: () => void } | null = null;

function closeAssistPopover(): void {
	open?.close();
}

export function toggleAssistPopover(
	anchor: HTMLElement,
	render: (dismiss: (restoreFocus: boolean) => void) => ReactNode,
): void {
	const wasAnchor = open?.anchor;
	closeAssistPopover();
	if (wasAnchor === anchor) return;

	const host = document.createElement("div");
	host.setAttribute("data-assist-popover", "");
	const unmount = mountHost(host, anchor);

	const close = () => {
		if (open?.close !== close) return;
		open = null;
		unmount();
		host.remove();
		queueMicrotask(() => root.unmount());
	};
	open = { anchor, close };

	const root = renderInShadow(
		host,
		"assist-popover",
		render((restoreFocus) => {
			close();
			if (restoreFocus) anchor.focus();
		}),
	);
}
