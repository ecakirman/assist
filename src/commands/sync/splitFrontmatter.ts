export function splitFrontmatter(content: string): {
	frontmatter: string;
	body: string;
	description: string | undefined;
} {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	const frontmatter = match ? match[1] : "";
	const body = match ? content.slice(match[0].length) : content;
	const descriptionMatch = frontmatter.match(/^description:\s*(.*)$/m);
	const description = descriptionMatch
		? descriptionMatch[1].trim().replace(/^["']|["']$/g, "")
		: undefined;
	return { frontmatter, body, description };
}
