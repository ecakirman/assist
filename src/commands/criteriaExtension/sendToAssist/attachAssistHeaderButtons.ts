import { assistSendButton } from "./assistSendButton";
import { githubItemUrl } from "./githubItemUrl";

const HEADER_ACTIONS_SELECTOR =
	'.gh-header-actions, [data-component="PH_Actions"]';

export function attachAssistHeaderButtons(): void {
	if (!githubItemUrl(location)) return;
	for (const actions of document.querySelectorAll<HTMLElement>(
		HEADER_ACTIONS_SELECTOR,
	)) {
		if (actions.querySelector(":scope > [data-assist-send]")) continue;
		actions.prepend(
			assistSendButton(
				() => githubItemUrl(location) ?? location.href,
				"Start an assist session from this page",
			),
		);
	}
}
