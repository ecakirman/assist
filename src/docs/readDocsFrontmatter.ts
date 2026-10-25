import { parse } from "yaml";

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export function readDocsFrontmatter(markdown: string): unknown {
	const match = markdown.match(frontmatterPattern);
	if (!match) throw new Error("missing --- frontmatter block");
	return parse(match[1]);
}
