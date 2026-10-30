import type { IncomingMessage, ServerResponse } from "node:http";
import { loadConfig } from "../../../../shared/loadConfig";
import { launchFromGithub } from "./launchFromGithub";
import { launchPlannedSession } from "./launchPlannedSession";
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
		(plan) => launchPlannedSession(plan),
	);
}
