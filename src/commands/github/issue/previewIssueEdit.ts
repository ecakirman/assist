import { readBodyArgument } from "../../prs/readBodyArgument";
import { prepareIssueEdit } from "./prepareIssueEdit";
import { pushUnchangedIssue } from "./pushUnchangedIssue";
import { reviewProposedIssueEdit } from "./reviewProposedIssueEdit";
import { validateIssueBody } from "./validateIssueBody";

export async function previewIssueEdit(
	number: number,
	repo: string | undefined,
	fresh: boolean | undefined,
	body: string | undefined,
): Promise<void> {
	const proposed = body ? await readBodyArgument(body) : undefined;
	const issue = prepareIssueEdit(number, repo, fresh, proposed);
	const edited = await reviewProposedIssueEdit(
		`Edit ${issue.target}: ${issue.title}`,
		issue.body,
		{ path: issue.bodyPath, save: issue.save },
	);
	validateIssueBody(issue.title, edited);

	pushUnchangedIssue(
		number,
		repo,
		issue.target,
		issue.updatedAt,
		issue.bodyPath,
	);
}
