import { runGhOrThrow } from "../../../shared/runGhOrThrow";
import { parseIssueTarget } from "./parseIssueTarget";

type UnassignIssueOptions = {
	repo?: string;
	assignee?: string[];
};

const USAGE =
	"Usage: assist github issue unassign <number> [-R <owner>/<repo>] [--assignee <login>...]";

export function unassignIssue(
	numberArg: string,
	options: UnassignIssueOptions,
): void {
	const { number, slug } = parseIssueTarget(numberArg, options.repo, USAGE);
	const assignees = options.assignee?.length ? options.assignee : ["@me"];

	try {
		runGhOrThrow(
			[
				"issue",
				"edit",
				String(number),
				"--repo",
				slug,
				...assignees.flatMap((login) => ["--remove-assignee", login]),
			],
			`Could not unassign ${assignees.join(", ")} from ${slug}#${number}`,
		);
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
	console.log(`Removed ${assignees.join(", ")} from ${slug}#${number}`);
}
