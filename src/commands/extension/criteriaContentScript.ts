import { attachAssistButtons } from "./sendToAssist/attachAssistButtons";
import { attachAssistHeaderButtons } from "./sendToAssist/attachAssistHeaderButtons";
import { attachAzureDevopsHeaderButton } from "./sendToAssist/attachAzureDevopsHeaderButton";
import { watchCriteriaEditors } from "./watchCriteriaEditors";
import { watchGithubPage } from "./watchGithubPage";

function isAzureDevopsHost(hostname: string): boolean {
	return hostname === "dev.azure.com" || hostname.endsWith(".visualstudio.com");
}

export function criteriaContentScript(): void {
	if (isAzureDevopsHost(location.hostname)) {
		watchGithubPage(attachAzureDevopsHeaderButton);
		return;
	}
	watchCriteriaEditors();
	watchGithubPage(() => {
		attachAssistButtons();
		attachAssistHeaderButtons();
	});
}

criteriaContentScript();
