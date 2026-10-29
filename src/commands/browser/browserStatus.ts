import chalk from "chalk";
import { requestBrowser } from "./requestBrowser";

export async function browserStatus(options: {
	url?: string;
	server: string;
}): Promise<void> {
	const reply = await requestBrowser(options.server, {
		op: "status",
		url: options.url,
	}).catch((error: Error) => {
		console.error(chalk.red(`Error: ${error.message}`));
		process.exit(1);
	});
	console.log(`extension: connected (v${reply.version})`);
	if (!reply.ok) {
		if (reply.tabUrl) console.log(`tab: ${reply.tabUrl}`);
		console.error(chalk.red(`Error: ${reply.error}`));
		process.exit(1);
	}
	console.log(`tab: ${reply.result.tabUrl}`);
	console.log(
		`content script: ${reply.result.contentScript ? "running" : "not running (reload the tab, or update the extension)"}`,
	);
}
