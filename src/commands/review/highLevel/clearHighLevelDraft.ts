import { rmSync } from "node:fs";
import { highLevelDraftPath } from "./highLevelDraftPath";

export function clearHighLevelDraft(
	repo: string,
	headRef: string,
	headSha: string,
): void {
	rmSync(highLevelDraftPath(repo, headRef, headSha), { force: true });
}
