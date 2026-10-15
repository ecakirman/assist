export function appendCiFooter(body: string, ciFooter?: string): string {
	return ciFooter ? `${body}\n\n${ciFooter}` : body;
}
