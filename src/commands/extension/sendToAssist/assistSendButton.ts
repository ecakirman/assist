import { githubPullNumber } from "../../../shared/githubPullNumber";
import {
	type AssistSendRequest,
	assistPopoverContent,
} from "./assistPopoverContent";
import { ensureAssistButtonStyles } from "./ensureAssistButtonStyles";
import { sendToAssist } from "./sendToAssist";
import { showAssistToast } from "./showAssistToast";
import { toggleAssistPopover } from "./toggleAssistPopover";
import { assistIcon } from "./assistIcon";

const LABEL = "assist";

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

	const send = async (request: AssistSendRequest) => {
		button.disabled = true;
		label.textContent = "sending…";
		const result = await sendToAssist({ url: url(), ...request });
		showAssistToast(result.message, result.ok);
		button.disabled = false;
		label.textContent = LABEL;
	};

	button.addEventListener("mousedown", (event) => event.preventDefault());
	button.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		const reviewMenu = placement === "header" && githubPullNumber(url());
		toggleAssistPopover(button, (dismiss) =>
			assistPopoverContent(reviewMenu ? "review" : "instructions", {
				send,
				dismiss,
			}),
		);
	});
	return button;
}
