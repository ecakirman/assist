import type { IncomingMessage, ServerResponse } from "node:http";
import { loadConfig } from "../../../../shared/loadConfig";
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
		(plan) => requestClaudeSession(plan.prompt, plan.cwd),
	);
}
