import { attachCriteriaToggle } from "./attachCriteriaToggle";
import { isIssueBodyPage } from "./isIssueBodyPage";
import { isIssueBodyTextarea } from "./isIssueBodyTextarea";

export function attachCriteriaEditors(): void {
	if (!isIssueBodyPage(globalThis.location)) return;
	for (const textarea of document.querySelectorAll("textarea")) {
		if (isIssueBodyTextarea(textarea)) attachCriteriaToggle(textarea);
	}
}
