import { runGhOrThrow } from "../../../shared/runGhOrThrow";
import { parseIssueTarget } from "./parseIssueTarget";

type UnassignIssueOptions = {
	repo?: string;
};

const USAGE =
	"Usage: assist github issue unassign <number> [-R <owner>/<repo>]";

export function unassignIssue(
	numberArg: string,
	options: UnassignIssueOptions,
): void {
	const { number, slug } = parseIssueTarget(numberArg, options.repo, USAGE);

	try {
		runGhOrThrow(
			[
				"issue",
				"edit",
				String(number),
				"--repo",
				slug,
				"--remove-assignee",
				"@me",
			],
			`Could not unassign you from ${slug}#${number}`,
		);
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
	console.log(`Removed @me from ${slug}#${number}`);
}
