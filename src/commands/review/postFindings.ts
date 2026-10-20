import { comment } from "../prs/comment";
import type { LineBoundFinding } from "./partitionFindings";
import { sanitiseReviewerNames } from "./sanitiseReviewerNames";

export function buildCommentBody(finding: LineBoundFinding): string {
	const lines: string[] = [];
	const severityLabel = finding.severity ?? "finding";
	lines.push(`**${severityLabel}: ${finding.title}**`);
	if (finding.impact) lines.push("", `Impact: ${finding.impact}`);
	if (finding.recommendation)
		lines.push("", `Recommendation: ${finding.recommendation}`);
	return sanitiseReviewerNames(lines.join("\n"));
}

type PostFindingsResult = {
	posted: number;
	failed: LineBoundFinding[];
};

export async function postFindings(
	findings: LineBoundFinding[],
): Promise<PostFindingsResult> {
	let posted = 0;
	const failed: LineBoundFinding[] = [];
	for (const finding of findings) {
		const body = buildCommentBody(finding);
		try {
			await comment(finding.file, finding.line, body, {
				startLine: finding.startLine,
				skipPreview: true,
			});
			posted++;
		} catch (error) {
			failed.push(finding);
			const message = error instanceof Error ? error.message : String(error);
			console.error(
				`Failed to post comment on ${finding.file}:${finding.line}: ${message}`,
			);
		}
	}
	return { posted, failed };
}
