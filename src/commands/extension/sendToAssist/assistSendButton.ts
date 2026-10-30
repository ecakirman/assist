import { assistPopoverContent } from "./assistPopoverContent";
import { ensureAssistButtonStyles } from "./ensureAssistButtonStyles";
import type { AssistSendRequest } from "./isAssistSendMessage";
import { sendToAssist } from "./sendToAssist";
import { showAssistToast } from "./showAssistToast";
import { toggleAssistPopover } from "./toggleAssistPopover";
import { assistIcon } from "./assistIcon";
import { type AssistSendTarget, popoverKind } from "./popoverKind";

const LABEL = "assist";

async function resolveTarget(target: AssistSendTarget): Promise<string> {
	return typeof target === "function" ? target() : target.link();
}

export function assistSendButton(
	target: AssistSendTarget,
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

	const send = async (request: AssistSendRequest) => {
		button.disabled = true;
		label.textContent = "sending…";
		const result = await resolveTarget(target).then(
			(url) => sendToAssist({ url, ...request }),
			(error: unknown) => ({
				ok: false,
				message: error instanceof Error ? error.message : String(error),
			}),
		);
		showAssistToast(result.message, result.ok);
		button.disabled = false;
		label.textContent = LABEL;
	};

	button.addEventListener("mousedown", (event) => event.preventDefault());
	button.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleAssistPopover(button, (dismiss) =>
			assistPopoverContent(popoverKind(placement, target), { send, dismiss }),
		);
	});
	return button;
}
