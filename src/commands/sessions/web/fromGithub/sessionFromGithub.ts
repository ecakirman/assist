import type { IncomingMessage, ServerResponse } from "node:http";
import { githubAssistModes } from "../../../../shared/githubAssistModes";
import { loadConfig } from "../../../../shared/loadConfig";
import { requestAssistSession } from "../../shared/requestAssistSession";
import { requestClaudeSession } from "../../shared/requestClaudeSession";
import { launchFromGithub } from "./launchFromGithub";
import { planGithubSession } from "./planGithubSession";

export function sessionFromGithub(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	return launchFromGithub(
		req,
		res,
		(body, baseDir) =>
			planGithubSession(body, baseDir, loadConfig().extension?.redirects),
		(plan) =>
			plan.mode
				? requestAssistSession(
						[...githubAssistModes[plan.mode], plan.prompt],
						plan.cwd,
					)
				: requestClaudeSession(plan.prompt, plan.cwd),
	);
}
