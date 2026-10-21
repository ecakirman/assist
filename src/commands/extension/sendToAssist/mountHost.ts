const WIDTH = 320;

const GUTTER = 16;

export function mountHost(host: HTMLElement, anchor: HTMLElement): () => void {
	const dialog = anchor.closest<HTMLElement>('dialog, [role="dialog"]');
	const style = dialog ? topLayerHostStyle : pageHostStyle;
	const place = () => {
		host.style.cssText = style(anchor);
	};
	place();
	if (dialog) {
		host.setAttribute("popover", "manual");
		dialog.append(host);
		host.showPopover?.();
	} else document.body.append(host);
	window.addEventListener("resize", place);
	return () => window.removeEventListener("resize", place);
}

function pageHostStyle(anchor: HTMLElement): string {
	const { top, left } = anchorPosition(anchor);
	return [
		"position: absolute",
		`top: ${top + window.scrollY}px`,
		`left: ${left + window.scrollX}px`,
		`width: ${WIDTH}px`,
		"z-index: 2147483646",
	].join(";");
}

function topLayerHostStyle(anchor: HTMLElement): string {
	const { top, left } = anchorPosition(anchor);
	return [
		"position: fixed",
		"inset: auto",
		`top: ${top}px`,
		`left: ${left}px`,
		`width: ${WIDTH}px`,
		"height: auto",
		"margin: 0",
		"padding: 0",
		"border: 0",
		"background: transparent",
		"overflow: visible",
	].join(";");
}

function anchorPosition(anchor: HTMLElement): { top: number; left: number } {
	const rect = anchor.getBoundingClientRect();
	const left = Math.max(
		GUTTER,
		Math.min(rect.left, window.innerWidth - WIDTH - GUTTER),
	);
	return { top: rect.bottom + 4, left };
}
