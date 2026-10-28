import { parseAzureDevopsPrUrl } from "../../../shared/azureDevops/parseAzureDevopsPrUrl";
import { assistSendButton } from "./assistSendButton";

const COMPLETE_BUTTON_SELECTOR =
	".repos-pr-header .repos-pr-header-complete-button";

export function attachAzureDevopsHeaderButton(): void {
	const pr = parseAzureDevopsPrUrl(location.href);
	if (!pr) {
		for (const stale of document.querySelectorAll(
			".assist-send--header[data-assist-send]",
		))
			stale.remove();
		return;
	}
	const actions = document.querySelector(
		COMPLETE_BUTTON_SELECTOR,
	)?.parentElement;
	if (!actions || actions.querySelector(":scope > [data-assist-send]")) return;
	actions.prepend(
		assistSendButton(
			() => parseAzureDevopsPrUrl(location.href)?.url ?? location.href,
			"Start an assist session for this PR",
			"header",
		),
	);
}
