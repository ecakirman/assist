import { escapeHtml } from "./escapeHtml";
import type { DocsNavGroup } from "./orderDocsPages";

const menuIcon =
	'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

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
	const brand = `<a class="brand" href="${basePath}">assist</a>`;
	return `<input type="checkbox" id="nav-toggle" class="nav-toggle"><header class="topbar"><label for="nav-toggle" class="nav-button" aria-label="Menu">${menuIcon}</label>${brand}</header><label for="nav-toggle" class="nav-backdrop"></label><nav>${brand}${groups.join("")}</nav>`;
}
