import { promptIssueRef } from "../shared/promptIssueRef";
import { promptPrNumber } from "../shared/promptPrNumber";
import type { Session, SessionInfo } from "./createSession";
import { repoGroupForCwd } from "./repoGroupForCwd";
import { toSessionRunInfo } from "./toSessionRunInfo";
import { joinRefusal } from "./worktree/joinRefusal";

export function toSessionInfo(session: Session): SessionInfo {
	const {
		id,
		name,
		title,
		generatedTitle,
		subtitle,
		commandType,
		harness,
		cwd,
		launchedFrom,
		claudeSessionId,
		harnessSessionId,
		restored,
		autoAdvance,
		autoApprove,
		starred,
		design,
		verifying,
		seeding,
		pendingPrPreview,
		pendingShow,
		undurable,
		lastUserMessage,
		activeViewer,
		activeViewerNode,
	} = session;
	return {
		...toSessionRunInfo(session),
		id,
		name,
		title,
		generatedTitle,
		subtitle,
		commandType,
		harness,
		cwd,
		launchedFrom,
		claudeSessionId,
		harnessSessionId,
		repoGroup: repoGroupForCwd(cwd),
		restored,
		autoAdvance,
		autoApprove,
		starred,
		design,
		verifying,
		seeding,
		pendingPrPreview,
		pendingShow,
		undurable,
		lastUserMessage,
		activeViewer,
		activeViewerNode,
		promptIssue: promptIssueRef(session.initialPrompt),
		promptPr: promptPrNumber(session.initialPrompt),
		joinable: joinRefusal(session) === undefined,
	};
}
