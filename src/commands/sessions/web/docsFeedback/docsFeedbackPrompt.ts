import type { DocsFeedback } from "./docsFeedbackSchema";

export function docsFeedbackPrompt({
	pageId,
	heading,
	source,
	selection,
	prompt,
}: DocsFeedback): string {
	const quoted = selection
		.trim()
		.split(/\r?\n/)
		.map((line) => `> ${line}`)
		.join("\n");
	return [
		`Docs feedback on page \`${pageId}\`, section "${heading}" (${source}):`,
		quoted,
		prompt.trim(),
	].join("\n\n");
}
