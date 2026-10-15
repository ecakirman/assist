import type { ReactNode } from "react";
import { renderInShadow } from "../renderInShadow";

const WIDTH = 320;
const GUTTER = 16;

let open: { anchor: HTMLElement; close: () => void } | null = null;

function hostStyle(anchor: HTMLElement): string {
	const rect = anchor.getBoundingClientRect();
	const left = Math.max(
		GUTTER,
		Math.min(rect.left, window.innerWidth - WIDTH - GUTTER),
	);
	return [
		"position: absolute",
		`top: ${rect.bottom + window.scrollY + 4}px`,
		`left: ${left + window.scrollX}px`,
		`width: ${WIDTH}px`,
		"z-index: 2147483646",
	].join(";");
}

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
	host.style.cssText = hostStyle(anchor);
	document.body.append(host);

	const close = () => {
		if (open?.close !== close) return;
		open = null;
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
