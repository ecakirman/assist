import type { IncomingMessage, ServerResponse } from "node:http";
import { getCwdParam } from "./getCwdParam";

export function getCwdAndQuery(
	req: IncomingMessage,
	res: ServerResponse,
): { cwd: string; query: string } | null {
	const cwd = getCwdParam(req, res);
	if (!cwd) return null;
	const query =
		new URL(req.url ?? "/", "http://localhost").searchParams.get("q") ?? "";
	return { cwd, query };
}
