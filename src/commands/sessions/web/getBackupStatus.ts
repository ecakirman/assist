import type { IncomingMessage, ServerResponse } from "node:http";
import { loadConfig } from "../../../shared/loadConfig";
import { parseDuration } from "../../../shared/parseDuration";
import { respondJson } from "../../../shared/web";

export function getBackupStatus(
	_req: IncomingMessage,
	res: ServerResponse,
): void {
	const staleAfterMs = parseDuration(loadConfig().backup.staleAfter);
	respondJson(res, 200, { staleAfterMs });
}
