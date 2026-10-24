import { assistIcon } from "../sendToAssist/assistIcon";
import { showAssistToast } from "../sendToAssist/showAssistToast";
import { toggleAssistPopover } from "../sendToAssist/toggleAssistPopover";
import { docsFeedbackPopover } from "./docsFeedbackPopover";
import type { DocsSelection } from "./readDocsSelection";
import { sendDocsFeedback } from "./sendDocsFeedback";

const SIZE = 24;

const BUTTON_STYLE = [
	"position: absolute",
	`width: ${SIZE}px`,
	`height: ${SIZE}px`,
	"padding: 3px",
	"border: 1px solid #d1d9e0",
	"border-radius: 50%",
	"background: #fff",
	"box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2)",
	"cursor: pointer",
	"z-index: 2147483645",
].join(";");

function endOfRange(range: Range): { top: number; left: number } {
	const rects = range.getClientRects();
	const last = rects[rects.length - 1] ?? range.getBoundingClientRect();
	return {
		top: last.bottom + window.scrollY + 4,
		left: last.right + window.scrollX - SIZE / 2,
	};
}

export function docsFeedbackButton(
	selection: DocsSelection,
): HTMLButtonElement {
	const button = document.createElement("button");
	button.type = "button";
	button.setAttribute("data-assist-docs-feedback", "");
	button.title = "Send feedback on this text to assist";
	const { top, left } = endOfRange(selection.range);
	button.style.cssText = `${BUTTON_STYLE};top: ${top}px;left: ${left}px`;
	const icon = assistIcon();
	if (icon) {
		icon.style.cssText = "width: 100%; height: 100%; display: block";
		button.append(icon);
	} else button.textContent = "a";

	const send = async (prompt: string) => {
		button.remove();
		const result = await sendDocsFeedback(selection, prompt);
		showAssistToast(result.message, result.ok);
	};

	button.addEventListener("mousedown", (event) => event.preventDefault());
	button.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleAssistPopover(button, (dismiss) =>
			docsFeedbackPopover(send, dismiss),
		);
	});
	return button;
}
