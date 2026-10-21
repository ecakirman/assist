import { assistSendButton } from "./assistSendButton";
import { githubItemUrl } from "./githubItemUrl";

const HEADER_ACTIONS_SELECTOR = [
	".gh-header-actions",
	'[data-component="PH_Actions"]',
	':has(> [role="group"][aria-label="Side panel controls"])',
].join(", ");

export function attachAssistHeaderButtons(): void {
	if (!githubItemUrl(location)) {
		for (const stale of document.querySelectorAll(
			".assist-send--header[data-assist-send]",
		))
			stale.remove();
		return;
	}
	for (const actions of document.querySelectorAll<HTMLElement>(
		HEADER_ACTIONS_SELECTOR,
	)) {
		if (actions.querySelector(":scope > [data-assist-send]")) continue;
		actions.prepend(
			assistSendButton(
				() => githubItemUrl(location) ?? location.href,
				"Start an assist session from this page",
				"header",
			),
		);
	}
}
