import type { IncomingMessage, ServerResponse } from "node:http";
import { requestAssistSession } from "../../shared/requestAssistSession";
import { launchFromGithub } from "./launchFromGithub";
import { planGithubReview } from "./planGithubReview";

export function reviewFromGithub(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	return launchFromGithub(req, res, planGithubReview, (plan) =>
		requestAssistSession(plan.assistArgs, plan.cwd),
	);
}
