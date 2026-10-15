import { ensureAssistButtonStyles } from "./ensureAssistButtonStyles";
import { extensionRuntime } from "./extensionRuntime";
import { sendToAssist } from "./sendToAssist";
import { showAssistToast } from "./showAssistToast";
import { toggleAssistPopover } from "./toggleAssistPopover";

const LABEL = "assist";
const ICON_PATH = "icons/assist-32.png";

function assistIcon(): HTMLImageElement | undefined {
	const src = extensionRuntime()?.getURL?.(ICON_PATH);
	if (!src) return undefined;
	const icon = document.createElement("img");
	icon.src = src;
	icon.alt = "";
	return icon;
}

export function assistSendButton(
	url: () => string,
	title: string,
	placement: "comment" | "header" = "comment",
): HTMLButtonElement {
	ensureAssistButtonStyles();
	const button = document.createElement("button");
	button.type = "button";
	button.setAttribute("data-assist-send", "");
	button.className =
		placement === "header" ? "assist-send assist-send--header" : "assist-send";
	button.title = title;
	const label = document.createElement("span");
	label.textContent = LABEL;
	const icon = assistIcon();
	if (icon) button.append(icon);
	button.append(label);

	const send = async (instructions: string) => {
		button.disabled = true;
		label.textContent = "sending…";
		const result = await sendToAssist(url(), instructions || undefined);
		showAssistToast(result.message, result.ok);
		button.disabled = false;
		label.textContent = LABEL;
	};

	button.addEventListener("mousedown", (event) => event.preventDefault());
	button.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleAssistPopover(button, send);
	});
	return button;
}
