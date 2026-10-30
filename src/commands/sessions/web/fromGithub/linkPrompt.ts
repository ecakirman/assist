export function linkPrompt(url: string, instructions: unknown): string {
	const extra = typeof instructions === "string" ? instructions.trim() : "";
	return extra ? `${url}\n\n${extra}` : url;
}
