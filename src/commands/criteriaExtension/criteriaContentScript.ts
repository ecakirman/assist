import { attachAssistButtons } from "./sendToAssist/attachAssistButtons";
import { attachAssistHeaderButtons } from "./sendToAssist/attachAssistHeaderButtons";
import { watchCriteriaEditors } from "./watchCriteriaEditors";
import { watchGithubPage } from "./watchGithubPage";

export function criteriaContentScript(): void {
	watchCriteriaEditors();
	watchGithubPage(() => {
		attachAssistButtons();
		attachAssistHeaderButtons();
	});
}

criteriaContentScript();
