import chalk from "chalk";
import { getDb } from "../../shared/db/getDb";
import { readInboxLastScan } from "../../shared/db/readInboxLastScan";
import { upsertInboxMessages } from "../../shared/db/upsertInboxMessages";
import { writeInboxLastScan } from "../../shared/db/writeInboxLastScan";
import { withSpinner } from "../../shared/withSpinner";
import type { FlaggedMessage } from "./inboxScanSchema";
import { runInboxScanClaude } from "./runInboxScanClaude";

const FIRST_SCAN_LOOKBACK_MS = 24 * 60 * 60_000;

function toRow(message: FlaggedMessage) {
	const receivedAt = message.receivedAt
		? new Date(message.receivedAt)
		: undefined;
	return {
		source: message.source,
		messageId: message.messageId,
		sender: message.sender,
		summary: message.summary,
		link: message.link,
		receivedAt:
			receivedAt && !Number.isNaN(receivedAt.getTime()) ? receivedAt : null,
	};
}

export async function scan(): Promise<void> {
	const orm = await getDb();
	const startedAt = new Date();
	const since =
		(await readInboxLastScan(orm)) ??
		new Date(startedAt.getTime() - FIRST_SCAN_LOOKBACK_MS);
	const flagged = await withSpinner(
		`Scanning Gmail and Slack (Slack since ${since.toISOString()})`,
		() => runInboxScanClaude(since),
	);
	const added = await upsertInboxMessages(orm, flagged.map(toRow));
	await writeInboxLastScan(orm, startedAt);
	console.log(
		`Flagged ${flagged.length} message(s) needing a reply, ${chalk.bold(added)} new.`,
	);
}
