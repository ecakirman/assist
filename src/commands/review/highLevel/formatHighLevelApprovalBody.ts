import type { HighLevelReviewItem, HighLevelTestComment } from "./types";

function indentContinuation(text: string): string {
	return text.replace(/\n/g, "\n  ");
}

function formatTestComment(note: HighLevelTestComment): string {
	const title = note.title.join(" › ");
	return `- \`${note.path}:${note.line}\` ${title}: ${indentContinuation(note.comment)}`;
}

function formatItem(item: HighLevelReviewItem): string | undefined {
	const notes = item.testComments ?? [];
	if (!item.comment && notes.length === 0) return undefined;
	const sections = [`**${item.title}**`];
	if (item.comment) sections.push(item.comment);
	if (notes.length > 0) sections.push(notes.map(formatTestComment).join("\n"));
	return sections.join("\n\n");
}

export function formatHighLevelApprovalBody(
	items: HighLevelReviewItem[],
): string {
	return items
		.map(formatItem)
		.filter((section) => section !== undefined)
		.join("\n\n");
}
