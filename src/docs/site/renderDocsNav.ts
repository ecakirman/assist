import { escapeHtml } from "./escapeHtml";
import type { DocsNavGroup } from "./orderDocsPages";

export function renderDocsNav(
	nav: DocsNavGroup[],
	activeId: string,
	basePath: string,
): string {
	const groups = nav.map(({ group, pages }) => {
		const links = pages.map((page) => {
			const current = page.id === activeId ? ' aria-current="page"' : "";
			return `<li><a href="${basePath}${page.id}/"${current}>${escapeHtml(page.title)}</a></li>`;
		});
		return `<section><h2>${escapeHtml(group)}</h2><ul>${links.join("")}</ul></section>`;
	});
	return `<nav><a class="brand" href="${basePath}">assist</a>${groups.join("")}</nav>`;
}
