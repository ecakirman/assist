import {
	type GithubAssistMode,
	githubAssistModes,
} from "../../../../shared/githubAssistModes";
import { requestAssistSession } from "../../shared/requestAssistSession";
import { requestClaudeSession } from "../../shared/requestClaudeSession";

export function launchPlannedSession(plan: {
	cwd: string;
	prompt: string;
	mode?: GithubAssistMode;
}): Promise<string> {
	return plan.mode
		? requestAssistSession(
				[...githubAssistModes[plan.mode], plan.prompt],
				plan.cwd,
			)
		: requestClaudeSession(plan.prompt, plan.cwd);
}
