import chalk from "chalk";
import { recordSessionRefs } from "../../shared/db/recordSessionRefs";
import { formatItemId } from "./formatItemId";

export async function recordSlack(
	url: string,
	options: { title?: string },
): Promise<void> {
	const result = await recordSessionRefs([
		{ kind: "slack", ref: url, url, title: options.title },
	]);
	switch (result.status) {
		case "no-session":
			console.log(
				"No current backlog item in this session, so the Slack link was not recorded.",
			);
			return;
		case "recorded":
			console.log(
				chalk.green(
					`Attached Slack link to item ${formatItemId(result.itemId)}.`,
				),
			);
			return;
		case "failed":
			console.error(
				chalk.red(
					`Failed to record Slack link against item ${formatItemId(result.itemId)}: ${errorMessage(result.error)}`,
				),
			);
			process.exitCode = 1;
	}
}

function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
