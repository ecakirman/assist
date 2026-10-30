import { eq } from "drizzle-orm";
import type { BacklogDatabase } from "./Db";
import { metadata } from "./schema";

export const INBOX_LAST_SCAN_KEY = "inbox.lastScanAt";

export async function readInboxLastScan(
	orm: BacklogDatabase,
): Promise<Date | undefined> {
	const [row] = await orm
		.select()
		.from(metadata)
		.where(eq(metadata.key, INBOX_LAST_SCAN_KEY));
	return row ? new Date(row.value) : undefined;
}
