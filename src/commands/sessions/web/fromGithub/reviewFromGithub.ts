import type { IncomingMessage, ServerResponse } from "node:http";
import { requestAssistSession } from "../../shared/requestAssistSession";
import { launchFromGithub } from "./launchFromGithub";
import { planPrReview } from "./planPrReview";

export function reviewFromGithub(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	return launchFromGithub(req, res, planPrReview, (plan) =>
		requestAssistSession(plan.assistArgs, plan.cwd),
	);
}
