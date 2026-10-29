import type { InspectResult } from "../extension/browserLink/types";

export function formatInspectMatches(
	{ matches, total }: InspectResult,
	query: string,
): string[] {
	if (total === 0) return [`no elements match ${query}`];
	const lines = matches.flatMap((match, index) => [
		`[${index + 1}/${total}] ${match.width}×${match.height} ${JSON.stringify(match.text)}`,
		...match.chain.map((step) => `  ${step}`),
	]);
	if (total > matches.length)
		lines.push(
			`showing the first ${matches.length} of ${total} matches; narrow the query to see the rest`,
		);
	return lines;
}
