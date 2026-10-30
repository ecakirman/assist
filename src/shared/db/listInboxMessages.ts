import { desc, isNull, sql } from "drizzle-orm";
import type { BacklogDatabase } from "./Db";
import { inboxMessages } from "./inboxMessages";

type InboxMessageRow = typeof inboxMessages.$inferSelect;

export function listInboxMessages(
	orm: BacklogDatabase,
): Promise<InboxMessageRow[]> {
	return orm
		.select()
		.from(inboxMessages)
		.where(isNull(inboxMessages.dismissedAt))
		.orderBy(
			desc(
				sql`coalesce(${inboxMessages.receivedAt}, ${inboxMessages.flaggedAt})`,
			),
		);
}
