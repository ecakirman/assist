import chalk from "chalk";
import { getDb } from "../../shared/db/getDb";
import { listInboxMessages } from "../../shared/db/listInboxMessages";

export async function list(): Promise<void> {
	const messages = await listInboxMessages(await getDb());
	if (messages.length === 0) {
		console.log(chalk.dim("No flagged messages; run assist inbox scan"));
		return;
	}
	for (const message of messages) {
		const when = (message.receivedAt ?? message.flaggedAt).toISOString();
		console.log(
			`${chalk.dim(when)} ${chalk.cyan(message.source)} ${chalk.bold(message.sender)}`,
		);
		console.log(`  ${message.summary}`);
		console.log(`  ${chalk.dim(message.link)}`);
	}
}
