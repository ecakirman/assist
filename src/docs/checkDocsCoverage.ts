import { verifySection } from "../commands/verify/reportVerifyProblems";
import type { DocsArea } from "./docsAreas";
import type { DocsPage } from "./docsPageSchema";
import { findInternalBadgeProblems } from "./findInternalBadgeProblems";
import { findUnknownCovers } from "./findUnknownCovers";

type CoverageInput = {
	inventoryIds: string[];
	internal?: ReadonlyMap<string, string>;
	pages: DocsPage[];
	pending: Partial<Record<DocsArea, string[]>>;
};

function duplicates(ids: string[]): string[] {
	const seen = new Set<string>();
	return [...new Set(ids.filter((id) => seen.has(id) || !seen.add(id)))];
}

export function checkDocsCoverage({
	inventoryIds,
	internal = new Map(),
	pages,
	pending,
}: CoverageInput): (string | undefined)[] {
	const inventory = new Set(inventoryIds);
	const covered = new Set(pages.flatMap((page) => page.covers));
	const pendingIds = Object.values(pending).flat();
	const pendingSet = new Set(pendingIds);

	return [
		verifySection(
			"Items documented by no page (cover them on a docs page or add them to pendingUserDocumentation)",
			inventoryIds.filter((id) => !covered.has(id) && !pendingSet.has(id)),
		),
		verifySection(
			"Items now covered by a page but still in pendingUserDocumentation (remove them)",
			pendingIds.filter((id) => covered.has(id)),
		),
		verifySection(
			"Docs pages cover ids that are not in the inventory",
			findUnknownCovers(pages, inventory),
		),
		verifySection(
			"Internal commands must be marked :badge[internal], and only they may be",
			findInternalBadgeProblems(
				pages,
				new Set(inventoryIds.filter((id) => id.startsWith("cli:"))),
				internal,
			),
		),
		verifySection(
			"pendingUserDocumentation lists ids not in the inventory (remove them)",
			pendingIds.filter((id) => !inventory.has(id)),
		),
		verifySection(
			"pendingUserDocumentation lists ids more than once",
			duplicates(pendingIds),
		),
	];
}
