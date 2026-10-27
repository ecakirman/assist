import chalk from "chalk";
import { getDb } from "../../shared/db/getDb";
import { listFeeds } from "../backlog/listFeeds";

export async function list(): Promise<void> {
	const urls = await listFeeds(await getDb());
	if (urls.length === 0) {
		console.log(chalk.dim("No feeds; add one with assist news add <url>"));
		return;
	}
	for (const url of urls) console.log(url);
}
