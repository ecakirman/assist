export const screenshotPlaceholderPattern = /\{\{screenshot:([^}]+)\}\}/g;

export function screenshotPlaceholder(file: string): string {
	return `{{screenshot:${file}}}`;
}
