import { readdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { z } from "zod";
import { type DocsPage, docsPageSchema } from "./docsPageSchema";
import { docsPaths } from "./docsPaths";
import { readDocsFrontmatter } from "./readDocsFrontmatter";

function parsePage(file: string, text: string): DocsPage {
	let frontmatter: unknown;
	try {
		frontmatter = readDocsFrontmatter(text);
	} catch (error) {
		throw new Error(
			`${file}: invalid frontmatter (${(error as Error).message})`,
		);
	}
	const result = docsPageSchema.safeParse(frontmatter);
	if (!result.success)
		throw new Error(`${file}:\n${z.prettifyError(result.error)}`);
	if (result.data.id !== basename(file, ".md"))
		throw new Error(`${file}: id ${result.data.id} does not match file name`);
	return result.data;
}

export function loadDocsPages(pagesDir: string): DocsPage[] {
	return readdirSync(pagesDir)
		.filter((name) => name.endsWith(".md"))
		.sort()
		.map((name) => {
			const path = join(pagesDir, name);
			const body = readFileSync(path, "utf8");
			const page = parsePage(name, body);
			return { ...page, source: relative(docsPaths.repoRoot, path), body };
		});
}
