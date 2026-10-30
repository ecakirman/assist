import type { Migration } from "./Migration";

const sql = `
	CREATE TABLE IF NOT EXISTS inbox_messages (
		source TEXT NOT NULL,
		message_id TEXT NOT NULL,
		sender TEXT NOT NULL,
		summary TEXT NOT NULL,
		link TEXT NOT NULL,
		received_at TIMESTAMPTZ,
		flagged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
		dismissed_at TIMESTAMPTZ,
		PRIMARY KEY (source, message_id)
	);
`;

export const migration0009InboxMessages: Migration = {
	id: 9,
	name: "inbox-messages",
	sql,
};
