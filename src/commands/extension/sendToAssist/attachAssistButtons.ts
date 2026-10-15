import { assistSendButton } from "./assistSendButton";

const PERMALINK_SELECTOR = [
	'a[href*="#discussion_r"]',
	'a[href*="#issuecomment-"]',
	'a[href*="#pullrequestreview-"]',
].join(",");

function isCommentTimestamp(anchor: HTMLAnchorElement): boolean {
	return (
		anchor.classList.contains("js-timestamp") ||
		anchor.querySelector("relative-time") !== null
	);
}

export function attachAssistButtons(): void {
	for (const anchor of document.querySelectorAll<HTMLAnchorElement>(
		PERMALINK_SELECTOR,
	)) {
		if (!isCommentTimestamp(anchor)) continue;
		if (anchor.nextElementSibling?.hasAttribute("data-assist-send")) continue;
		anchor.after(
			assistSendButton(
				() => anchor.href,
				"Start an assist session from this comment",
			),
		);
	}
}
