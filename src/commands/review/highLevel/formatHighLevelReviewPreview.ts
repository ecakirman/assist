import type { PreviewReviewComment } from "../../sessions/shared/PreviewDecision";
import { formatReviewComment } from "./formatReviewComment";

export function formatHighLevelReviewPreview(
	lineLevel: PreviewReviewComment[],
	body: string,
): string {
	if (lineLevel.length === 0) return body;
	const sections = [
		`### Line-level comments\n\n${lineLevel.map(formatReviewComment).join("\n")}`,
	];
	if (body) sections.push(`### PR-level body\n\n${body}`);
	return sections.join("\n\n");
}
