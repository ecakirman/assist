import { toggleAssistPopover } from "../sendToAssist/toggleAssistPopover";
import { docsFeedbackPopover } from "./docsFeedbackPopover";
import { docsFeedbackSender } from "./docsFeedbackSender";
import { highlightRange } from "./highlightRange";
import type { DocsSelection } from "./readDocsSelection";

function endOfRange(range: Range): { top: number; left: number } {
	const rects = range.getClientRects();
	const last = rects[rects.length - 1] ?? range.getBoundingClientRect();
	return {
		top: last.bottom + window.scrollY,
		left: last.right + window.scrollX,
	};
}

function selectionEndAnchor(range: Range): HTMLElement {
	const anchor = document.createElement("div");
	anchor.setAttribute("data-assist-docs-feedback", "");
	anchor.setAttribute("aria-hidden", "true");
	const { top, left } = endOfRange(range);
	anchor.style.cssText = `position: absolute;top: ${top}px;left: ${left}px;width: 0;height: 0;pointer-events: none`;
	return anchor;
}

export function openDocsFeedback(selection: DocsSelection): () => void {
	const anchor = selectionEndAnchor(selection.range);
	document.body.append(anchor);
	const unhighlight = highlightRange(selection.range);
	const release = () => {
		anchor.remove();
		unhighlight();
	};
	const send = docsFeedbackSender(selection, release);
	toggleAssistPopover(anchor, (dismiss) =>
		docsFeedbackPopover(
			send,
			(restoreFocus) => {
				dismiss(restoreFocus);
				release();
			},
			{ selectedText: selection.range.toString() },
		),
	);
	return release;
}
