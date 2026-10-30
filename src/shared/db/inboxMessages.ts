import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const inboxMessages = pgTable(
	"inbox_messages",
	{
		source: text().notNull(),
		messageId: text("message_id").notNull(),
		sender: text().notNull(),
		summary: text().notNull(),
		link: text().notNull(),
		receivedAt: timestamp("received_at", { withTimezone: true }),
		flaggedAt: timestamp("flagged_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		dismissedAt: timestamp("dismissed_at", { withTimezone: true }),
	},
	(t) => [primaryKey({ columns: [t.source, t.messageId] })],
);
