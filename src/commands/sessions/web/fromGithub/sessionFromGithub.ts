import type { IncomingMessage, ServerResponse } from "node:http";
import { expandTilde } from "../../../../shared/expandTilde";
import { loadConfig } from "../../../../shared/loadConfig";
import { respondJson } from "../../../../shared/web";
import { requestClaudeSession } from "../../shared/requestClaudeSession";
import { readJsonBody } from "../readJsonBody";
import { allowExtensionOrigin } from "./allowExtensionOrigin";
import { planGithubSession } from "./planGithubSession";

export async function sessionFromGithub(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	allowExtensionOrigin(req, res);
	let body: unknown;
	try {
		body = await readJsonBody(req);
	} catch {
		respondJson(res, 400, { error: "Invalid JSON body" });
		return;
	}
	const plan = planGithubSession(body, expandTilde(loadConfig().clone.baseDir));
	if (!plan.ok) {
		respondJson(res, plan.status, { error: plan.error });
		return;
	}
	try {
		const sessionId = await requestClaudeSession(plan.prompt, plan.cwd);
		respondJson(res, 200, { sessionId, cwd: plan.cwd });
	} catch (error) {
		respondJson(res, 500, {
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
