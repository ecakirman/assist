import type { IncomingMessage, ServerResponse } from "node:http";
import { respondJson } from "../../../shared/web";
import { readConfigEntries } from "../../config/readConfigEntries";
import { withDbBackedConfigEntries } from "../../config/withDbBackedConfigEntries";
import { getCwdParam } from "./getCwdParam";

export async function getConfig(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	const cwd = getCwdParam(req, res);
	if (!cwd) return;
	try {
		respondJson(
			res,
			200,
			await withDbBackedConfigEntries(readConfigEntries(cwd)),
		);
	} catch (error) {
		respondJson(res, 500, {
			error: error instanceof Error ? error.message : "Failed to read config",
		});
	}
}
