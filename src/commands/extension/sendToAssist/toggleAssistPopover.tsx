import type { ReactNode } from "react";
import { renderInShadow } from "../renderInShadow";

const WIDTH = 320;
const GUTTER = 16;

let open: { anchor: HTMLElement; close: () => void } | null = null;

function modalPopoverContainer(anchor: HTMLElement): HTMLElement {
	return (
		anchor.closest<HTMLElement>('dialog, [role="dialog"]') ?? document.body
	);
}

function positionHost(host: HTMLElement, anchor: HTMLElement): void {
	const rect = anchor.getBoundingClientRect();
	const left = Math.max(
		GUTTER,
		Math.min(rect.left, window.innerWidth - WIDTH - GUTTER),
	);
	host.style.top = "0px";
	host.style.left = "0px";
	const origin = host.getBoundingClientRect();
	host.style.top = `${rect.bottom - origin.top + 4}px`;
	host.style.left = `${left - origin.left}px`;
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
	host.style.cssText = `position: absolute; width: ${WIDTH}px; z-index: 2147483646`;
	modalPopoverContainer(anchor).append(host);
	positionHost(host, anchor);

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
