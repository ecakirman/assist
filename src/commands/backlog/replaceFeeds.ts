import type { Db } from "../../shared/db/Db";
import { feeds } from "../../shared/db/schema";

export async function replaceFeeds(db: Db, urls: string[]): Promise<void> {
	const unique = [...new Set(urls)];
	await db.transaction(async (tx) => {
		await tx.delete(feeds);
		if (unique.length > 0)
			await tx.insert(feeds).values(unique.map((url) => ({ url })));
	});
}
