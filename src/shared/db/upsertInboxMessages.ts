import type { BacklogDatabase } from "./Db";
import { inboxMessages } from "./inboxMessages";

type NewInboxMessage = typeof inboxMessages.$inferInsert;

export async function upsertInboxMessages(
	orm: BacklogDatabase,
	messages: NewInboxMessage[],
): Promise<number> {
	if (messages.length === 0) return 0;
	const inserted = await orm
		.insert(inboxMessages)
		.values(messages)
		.onConflictDoNothing({
			target: [inboxMessages.source, inboxMessages.messageId],
		})
		.returning({ messageId: inboxMessages.messageId });
	return inserted.length;
}
