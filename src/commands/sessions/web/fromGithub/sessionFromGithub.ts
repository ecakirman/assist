import type { IncomingMessage, ServerResponse } from "node:http";
import { requestClaudeSession } from "../../shared/requestClaudeSession";
import { launchFromGithub } from "./launchFromGithub";
import { planGithubSession } from "./planGithubSession";

export function sessionFromGithub(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	return launchFromGithub(req, res, planGithubSession, (plan) =>
		requestClaudeSession(plan.prompt, plan.cwd),
	);
}
