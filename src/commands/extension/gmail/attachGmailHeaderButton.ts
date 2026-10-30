import { assistSendButton } from "../sendToAssist/assistSendButton";
import { gmailPermalink } from "./gmailPermalink";
import { resolveGmailMessageId } from "./resolveGmailMessageId";

const SUBJECT_SELECTOR = "h2.hP";
const OPEN_MESSAGE_SELECTOR = "div.adn[data-message-id]";

function openMessage(subject: HTMLElement): HTMLElement {
	const thread = subject.closest<HTMLElement>('[role="main"]') ?? document;
	const messages = thread.querySelectorAll<HTMLElement>(OPEN_MESSAGE_SELECTOR);
	const last = messages[messages.length - 1];
	if (!last) throw new Error("No open Gmail message found");
	return last;
}

export function attachGmailHeaderButton(): void {
	for (const subject of document.querySelectorAll<HTMLElement>(
		SUBJECT_SELECTOR,
	)) {
		const header = subject.parentElement;
		if (!header || header.querySelector(":scope > [data-assist-send]"))
			continue;
		subject.after(
			assistSendButton(
				{
					link: async () =>
						gmailPermalink(await resolveGmailMessageId(openMessage(subject))),
				},
				"Start an assist session from this email",
				"header",
			),
		);
	}
}
