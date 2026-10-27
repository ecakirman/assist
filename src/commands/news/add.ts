import chalk from "chalk";
import enquirer from "enquirer";
import { getDb } from "../../shared/db/getDb";
import { addFeed } from "../backlog/addFeed";

export async function add(url?: string): Promise<void> {
	if (!url) {
		const response = await enquirer.prompt<{ url: string }>({
			type: "input",
			name: "url",
			message: "RSS feed URL:",
			validate: (value: string) => {
				try {
					new URL(value);
					return true;
				} catch {
					return "Please enter a valid URL";
				}
			},
		});
		url = response.url;
	}

	const added = await addFeed(await getDb(), url);
	if (!added) {
		console.log(chalk.yellow("Feed already exists"));
		return;
	}
	console.log(chalk.green(`Added feed: ${url}`));
}
