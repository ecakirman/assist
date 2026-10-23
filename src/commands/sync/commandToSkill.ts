import { splitFrontmatter } from "./splitFrontmatter";

export function commandToSkill(name: string, content: string): string {
	const { body, description } = splitFrontmatter(content);
	const header = `---\nname: ${name}\ndescription: ${quoteYaml(description ?? name)}\n---\n\n`;
	return header + body.replace(/^\r?\n+/, "");
}

function quoteYaml(value: string): string {
	return `"${value.replace(/\\/g, String.raw`\\`).replace(/"/g, String.raw`\"`)}"`;
}
