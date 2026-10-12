import type { IncomingMessage, ServerResponse } from "node:http";
import { respondJson } from "../../../../shared/web";
import { getCwdParam } from "../getCwdParam";
import { compareCommits } from "./compareCommits";

export async function releasesCompare(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	const cwd = getCwdParam(req, res);
	if (!cwd) return;
	const params = new URL(req.url ?? "/", "http://localhost").searchParams;
	const repo = params.get("repo");
	const head = params.get("head");
	if (!repo || !head) {
		respondJson(res, 400, { error: "Missing repo or head" });
		return;
	}
	try {
		respondJson(
			res,
			200,
			await compareCommits(cwd, repo, params.get("base"), head),
		);
	} catch (error) {
		respondJson(res, 502, {
			error: error instanceof Error ? error.message : "gh compare failed",
		});
	}
}
