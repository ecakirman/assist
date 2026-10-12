import type { PreviewAttachment } from "../sessions/shared/PreviewAttachment";

export function screenshotReference({ path, alt }: PreviewAttachment): string {
	const target = /\s/.test(path) ? `<${path}>` : path;
	return `![${alt}](${target})`;
}
