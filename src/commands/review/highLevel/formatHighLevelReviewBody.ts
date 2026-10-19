import type { PreviewReviewComment } from "../../sessions/shared/PreviewDecision";
import type { HighLevelReviewItem } from "./types";

function indentContinuation(text: string): string {
	return text.replace(/\n/g, "\n  ");
}

function formatItem(item: HighLevelReviewItem): string | undefined {
	if (!item.comment) return undefined;
	return `**${item.title}**\n\n${item.comment}`;
}

function formatReviewComment({
	path,
	startLine,
	endLine,
	quote,
	note,
}: PreviewReviewComment): string {
	const lines =
		startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
	return `- \`${path}:${lines}\` ${quote}: ${indentContinuation(note)}`;
}

export function formatHighLevelReviewBody(
	items: HighLevelReviewItem[],
	reviewComments: PreviewReviewComment[] = [],
): string {
	const sections = items
		.map(formatItem)
		.filter((section) => section !== undefined);
	if (reviewComments.length > 0)
		sections.push(
			`**Comments**\n\n${reviewComments.map(formatReviewComment).join("\n")}`,
		);
	return sections.join("\n\n");
}
