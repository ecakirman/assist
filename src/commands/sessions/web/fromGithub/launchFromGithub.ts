import type { IncomingMessage, ServerResponse } from "node:http";
import { expandTilde } from "../../../../shared/expandTilde";
import { loadConfig } from "../../../../shared/loadConfig";
import { respondJson } from "../../../../shared/web";
import { readJsonBody } from "../readJsonBody";
import { allowExtensionOrigin } from "./allowExtensionOrigin";
import type { GithubPlanError } from "./resolveGithubClone";

export async function launchFromGithub<T extends { ok: true; cwd: string }>(
	req: IncomingMessage,
	res: ServerResponse,
	plan: (body: unknown, baseDir: string) => T | GithubPlanError,
	launch: (planned: T) => Promise<string>,
): Promise<void> {
	allowExtensionOrigin(req, res);
	let body: unknown;
	try {
		body = await readJsonBody(req);
	} catch {
		respondJson(res, 400, { error: "Invalid JSON body" });
		return;
	}
	const planned = plan(body, expandTilde(loadConfig().clone.baseDir));
	if (!planned.ok) {
		respondJson(res, planned.status, { error: planned.error });
		return;
	}
	try {
		const sessionId = await launch(planned);
		respondJson(res, 200, { sessionId, cwd: planned.cwd });
	} catch (error) {
		respondJson(res, 500, {
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
