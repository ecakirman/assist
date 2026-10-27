import chalk from "chalk";
import { getDb } from "../../shared/db/getDb";
import { removeFeed } from "../backlog/removeFeed";

export async function remove(url: string): Promise<void> {
	const removed = await removeFeed(await getDb(), url);
	if (!removed) {
		console.log(chalk.yellow(`No feed matches ${url}`));
		return;
	}
	console.log(chalk.green(`Removed feed: ${url}`));
}
