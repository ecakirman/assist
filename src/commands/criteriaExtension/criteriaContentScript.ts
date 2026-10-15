import { attachAssistButtons } from "./sendToAssist/attachAssistButtons";
import { watchCriteriaEditors } from "./watchCriteriaEditors";
import { watchGithubPage } from "./watchGithubPage";

export function criteriaContentScript(): void {
	watchCriteriaEditors();
	watchGithubPage(attachAssistButtons);
}

criteriaContentScript();
