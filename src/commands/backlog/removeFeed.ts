import { eq } from "drizzle-orm";
import type { BacklogDatabase } from "../../shared/db/Db";
import { feeds } from "../../shared/db/schema";

export async function removeFeed(
	db: BacklogDatabase,
	url: string,
): Promise<boolean> {
	const deleted = await db
		.delete(feeds)
		.where(eq(feeds.url, url))
		.returning({ id: feeds.id });
	return deleted.length > 0;
}
