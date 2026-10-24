const prUrlPrompt =
	/^https?:\/\/(?:www\.)?github\.com\/[^\s/#?]+\/[^\s/#?]+\/pull\/(\d+)(?![^\s/?#])/;

export function promptPrNumber(prompt: string | undefined): number | undefined {
	const match = prompt ? prUrlPrompt.exec(prompt.trim()) : null;
	return match ? Number(match[1]) : undefined;
}
