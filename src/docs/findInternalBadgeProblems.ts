import type { DocsPage } from "./docsPageSchema";

const internalBadge = ":badge[internal]";

function firstCommandOnLine(
	line: string,
	cliIds: ReadonlySet<string>,
): string | undefined {
	const match = /`assist ([^`]+)`/.exec(line);
	if (!match) return undefined;
	const words = match[1].split(/\s+/);
	for (let length = words.length; length > 0; length--) {
		const id = `cli:${words.slice(0, length).join(" ")}`;
		if (cliIds.has(id)) return id;
	}
	return undefined;
}

function pageProblems(
	page: DocsPage,
	cliIds: ReadonlySet<string>,
	internal: ReadonlyMap<string, string>,
): string[] {
	const badged = new Set<string>();
	const problems: string[] = [];
	for (const line of (page.body ?? "").split("\n")) {
		if (!line.includes(internalBadge)) continue;
		const id = firstCommandOnLine(line, cliIds);
		if (!id) problems.push(`${page.id}: ${internalBadge} marks no command`);
		else if (!internal.has(id))
			problems.push(
				`${page.id}: ${internalBadge} marks ${id}, which is not internal`,
			);
		else badged.add(id);
	}
	for (const id of page.covers)
		if (internal.has(id) && !badged.has(id))
			problems.push(
				`${page.id}: ${id} is internal (called by ${internal.get(id)}) but not marked ${internalBadge}`,
			);
	return problems;
}

export function findInternalBadgeProblems(
	pages: DocsPage[],
	cliIds: ReadonlySet<string>,
	internal: ReadonlyMap<string, string>,
): string[] {
	return pages.flatMap((page) => pageProblems(page, cliIds, internal));
}
