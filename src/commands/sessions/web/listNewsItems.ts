import type { IncomingMessage, ServerResponse } from "node:http";
import { respondJson } from "../../../shared/web";
import { listFeeds } from "../../backlog/listFeeds";
import { getReady } from "../../backlog/shared";
import { fetchFeeds } from "../../news/fetchFeeds";
import type { FeedItem } from "../../news/shared";

const CACHE_TTL_MS = 15 * 60_000;

type NewsCache = {
	feedsKey: string;
	expires: number;
	items: Promise<FeedItem[]>;
};

let cache: NewsCache | undefined;

export async function listNewsItems(
	_req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	const { orm } = await getReady();
	const urls = await listFeeds(orm);
	const feedsKey = urls.join("\n");
	const now = Date.now();
	if (!cache || cache.feedsKey !== feedsKey || cache.expires <= now) {
		const items = fetchFeeds(urls);
		cache = { feedsKey, expires: now + CACHE_TTL_MS, items };
		items.catch(() => {
			if (cache?.items === items) cache = undefined;
		});
	}
	respondJson(res, 200, await cache.items);
}
