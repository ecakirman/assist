import type { IncomingMessage, ServerResponse } from "node:http";
import { getDb } from "../../../../shared/db/getDb";
import { listInboxMessages } from "../../../../shared/db/listInboxMessages";
import { respondJson } from "../../../../shared/web";
import { inboxMessageKey } from "./inboxMessageKey";

export async function listInbox(
	_req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	const rows = await listInboxMessages(await getDb());
	respondJson(
		res,
		200,
		rows.map((row) => ({
			id: inboxMessageKey(row.source, row.messageId),
			source: row.source,
			sender: row.sender,
			summary: row.summary,
			link: row.link,
			receivedAt: (row.receivedAt ?? row.flaggedAt).toISOString(),
		})),
	);
}
