import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { z } from "zod";
import { type DocsPage, docsPageSchema } from "./docsPageSchema";
import { docsPaths } from "./docsPaths";

function parsePage(file: string, text: string): DocsPage {
	let json: unknown;
	try {
		json = JSON.parse(text);
	} catch (error) {
		throw new Error(`${file}: invalid JSON (${(error as Error).message})`);
	}
	const result = docsPageSchema.safeParse(json);
	if (!result.success)
		throw new Error(`${file}:\n${z.prettifyError(result.error)}`);
	return result.data;
}

export function loadDocsPages(pagesDir: string): DocsPage[] {
	const files = readdirSync(pagesDir)
		.filter((name) => name.endsWith(".json"))
		.sort();
	const pages = files.map((name) => {
		const path = join(pagesDir, name);
		const page = parsePage(name, readFileSync(path, "utf8"));
		return { ...page, source: relative(docsPaths.repoRoot, path) };
	});
	const seen = new Set<string>();
	for (const page of pages) {
		if (seen.has(page.id))
			throw new Error(`Duplicate docs page id: ${page.id}`);
		seen.add(page.id);
	}
	return pages;
}
