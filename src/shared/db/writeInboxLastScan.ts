import type { BacklogDatabase } from "./Db";
import { INBOX_LAST_SCAN_KEY } from "./readInboxLastScan";
import { metadata } from "./schema";

export async function writeInboxLastScan(
	orm: BacklogDatabase,
	at: Date,
): Promise<void> {
	const value = at.toISOString();
	await orm
		.insert(metadata)
		.values({ key: INBOX_LAST_SCAN_KEY, value })
		.onConflictDoUpdate({ target: metadata.key, set: { value } });
}
