import { sendToAssist } from "./sendToAssist";
import { showAssistToast } from "./showAssistToast";
import { toggleAssistPopover } from "./toggleAssistPopover";

const BUTTON_STYLE = [
	"font: inherit",
	"font-size: 12px",
	"line-height: 18px",
	"padding: 0 6px",
	"margin-left: 6px",
	"border-radius: 6px",
	"border: 1px solid var(--borderColor-default, #d0d7de)",
	"background: var(--bgColor-muted, transparent)",
	"color: var(--fgColor-muted, inherit)",
	"cursor: pointer",
	"vertical-align: middle",
	"align-self: center",
].join(";");

const LABEL = "assist";

export function assistSendButton(
	url: () => string,
	title: string,
): HTMLButtonElement {
	const button = document.createElement("button");
	button.type = "button";
	button.setAttribute("data-assist-send", "");
	button.title = title;
	button.style.cssText = BUTTON_STYLE;
	button.textContent = LABEL;

	const send = async (instructions: string) => {
		button.disabled = true;
		button.textContent = "sending…";
		const result = await sendToAssist(url(), instructions || undefined);
		showAssistToast(result.message, result.ok);
		button.disabled = false;
		button.textContent = LABEL;
	};

	button.addEventListener("mousedown", (event) => event.preventDefault());
	button.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleAssistPopover(button, send);
	});
	return button;
}
