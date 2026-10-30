import { assistSendButton } from "../sendToAssist/assistSendButton";
import { gmailPermalink } from "./gmailPermalink";
import { resolveGmailMessageId } from "./resolveGmailMessageId";

const MESSAGE_SELECTOR = "div.adn[data-message-id]";
const DATE_SELECTOR = "span.g3";

export function attachGmailMessageButtons(): void {
	for (const message of document.querySelectorAll<HTMLElement>(
		MESSAGE_SELECTOR,
	)) {
		const date = message.querySelector<HTMLElement>(DATE_SELECTOR);
		if (!date || message.querySelector("[data-assist-send]")) continue;
		const button = assistSendButton(
			{
				link: async () => gmailPermalink(await resolveGmailMessageId(message)),
			},
			"Start an assist session from this email",
		);
		button.classList.add("assist-send--before-date");
		date.before(button);
	}
}
