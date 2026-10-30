import { and, eq, isNull } from "drizzle-orm";
import type { BacklogDatabase } from "./Db";
import { inboxMessages } from "./inboxMessages";

export async function dismissInboxMessage(
	orm: BacklogDatabase,
	source: string,
	messageId: string,
): Promise<boolean> {
	const dismissed = await orm
		.update(inboxMessages)
		.set({ dismissedAt: new Date() })
		.where(
			and(
				eq(inboxMessages.source, source),
				eq(inboxMessages.messageId, messageId),
				isNull(inboxMessages.dismissedAt),
			),
		)
		.returning({ messageId: inboxMessages.messageId });
	return dismissed.length > 0;
}
