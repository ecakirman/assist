import { sendToAssist } from "./sendToAssist";
import { showAssistToast } from "./showAssistToast";

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
].join(";");

const LABEL = "assist";

export function assistSendButton(permalink: string): HTMLButtonElement {
	const button = document.createElement("button");
	button.type = "button";
	button.setAttribute("data-assist-send", "");
	button.title = "Start an assist session from this comment";
	button.style.cssText = BUTTON_STYLE;
	button.textContent = LABEL;
	button.addEventListener("click", async (event) => {
		event.preventDefault();
		event.stopPropagation();
		button.disabled = true;
		button.textContent = "sending…";
		const result = await sendToAssist(permalink);
		showAssistToast(result.message, result.ok);
		button.disabled = false;
		button.textContent = LABEL;
	});
	return button;
}
