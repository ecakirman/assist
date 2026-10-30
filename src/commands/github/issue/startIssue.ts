import { assignIssueToSelf } from "./assignIssueToSelf";
import { moveIssueToInProgress } from "./moveIssueToInProgress";
import { parseIssueTarget } from "./parseIssueTarget";

type StartIssueOptions = {
	repo?: string;
};

const USAGE = "Usage: assist github issue started <number> [-R <owner>/<repo>]";

export function startIssue(
	numberArg: string,
	options: StartIssueOptions,
): void {
	const { owner, repo, number, slug } = parseIssueTarget(
		numberArg,
		options.repo,
		USAGE,
	);

	try {
		assignIssueToSelf(number, slug);
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
	console.log(`Assigned ${slug}#${number} to you`);

	moveIssueToInProgress({ owner, repo, number });
}
