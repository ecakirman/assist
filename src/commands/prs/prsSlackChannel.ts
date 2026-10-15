import { loadConfig } from "../../shared/loadConfig";

export function prsSlackChannel(): void {
	const config = loadConfig();
	const channel =
		config.prs?.slack?.trim() || config.slack?.channel?.trim() || "";
	if (!channel) {
		console.error(
			'No PR channel configured. Set prs.slack or slack.channel, e.g.: assist config set prs.slack "#pull-requests"',
		);
		process.exit(1);
	}
	console.log(channel);
}
