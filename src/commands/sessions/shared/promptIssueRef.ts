const issuePrompt = /^Issue ([^\s#]+\/[^\s#]+)#(\d+):/;
const issueUrlPrompt =
	/^https?:\/\/(?:www\.)?github\.com\/([^\s/#?]+\/[^\s/#?]+)\/issues\/(\d+)(?![^\s?#])/;

export function promptIssueRef(prompt: string | undefined): string | undefined {
	if (!prompt) return undefined;
	const match = issuePrompt.exec(prompt) ?? issueUrlPrompt.exec(prompt.trim());
	return match ? `${match[1]}#${match[2]}` : undefined;
}
