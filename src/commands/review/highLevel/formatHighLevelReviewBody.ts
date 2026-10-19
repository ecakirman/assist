import type { PreviewReviewComment } from "../../sessions/shared/PreviewDecision";
import { formatReviewComment } from "./formatReviewComment";
import type { HighLevelReviewItem } from "./types";

function formatItem(item: HighLevelReviewItem): string | undefined {
	if (!item.comment) return undefined;
	return `**${item.title}**\n\n${item.comment}`;
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
