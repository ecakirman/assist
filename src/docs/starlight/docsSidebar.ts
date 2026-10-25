import { docsPaths } from "../docsPaths";
import { loadDocsPages } from "../loadDocsPages";
import { orderDocsPages } from "./orderDocsPages";

export function docsSidebar(): { label: string; items: string[] }[] {
	return orderDocsPages(loadDocsPages(docsPaths.pagesDir)).map(
		({ group, pages }) => ({
			label: group,
			items: pages.map((page) => page.id),
		}),
	);
}
