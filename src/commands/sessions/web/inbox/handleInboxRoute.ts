import type { IncomingMessage, ServerResponse } from "node:http";
import { dismissInboxMessage } from "../../../../shared/db/dismissInboxMessage";
import { getDb } from "../../../../shared/db/getDb";
import { respondJson } from "../../../../shared/web";
import { parseInboxMessageKey } from "./inboxMessageKey";

const DISMISS = /^\/api\/inbox\/([^/]+)\/dismiss$/;

export async function handleInboxRoute(
	req: IncomingMessage,
	res: ServerResponse,
	pathname: string,
): Promise<boolean> {
	const match = DISMISS.exec(pathname);
	if (!match || req.method !== "POST") return false;
	const key = parseInboxMessageKey(decodeURIComponent(match[1]));
	if (!key) {
		respondJson(res, 400, { error: "Invalid inbox message id" });
		return true;
	}
	const dismissed = await dismissInboxMessage(
		await getDb(),
		key.source,
		key.messageId,
	);
	respondJson(
		res,
		dismissed ? 200 : 404,
		dismissed ? { ok: true } : { error: "Not found" },
	);
	return true;
}
