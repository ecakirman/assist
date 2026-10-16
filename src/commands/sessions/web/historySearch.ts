import type { IncomingMessage, ServerResponse } from "node:http";
import { respondJson } from "../../../shared/web";
import { requestDaemonReply } from "../daemon/requestDaemonReply";
import type { HistoricalSession } from "../shared/parseSessionFile";
import { getCwdAndQuery } from "./getCwdAndQuery";

const SEARCH_TIMEOUT_MS = 15_000;

type HistorySearchReply = {
	sessions?: HistoricalSession[];
	error?: string;
};

export async function historySearch(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	const params = getCwdAndQuery(req, res);
	if (!params) return;
	const reply = await requestDaemonReply<HistorySearchReply>(
		{ type: "search-history", ...params },
		"history-search",
		SEARCH_TIMEOUT_MS,
	);
	if (!reply) {
		respondJson(res, 504, { error: "Daemon did not answer the search" });
		return;
	}
	if (reply.error) {
		respondJson(res, 500, { error: reply.error });
		return;
	}
	respondJson(res, 200, { sessions: reply.sessions ?? [] });
}
