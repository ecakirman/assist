import { attachCriteriaEditors } from "./attachCriteriaEditors";
import { watchGithubPage } from "./watchGithubPage";

export function watchCriteriaEditors(): void {
	watchGithubPage(attachCriteriaEditors);
}
