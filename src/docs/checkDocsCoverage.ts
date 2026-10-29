import { verifySection } from "../commands/verify/reportVerifyProblems";
import type { DocsPage } from "./docsPageSchema";
import { findInternalBadgeProblems } from "./findInternalBadgeProblems";
import { findUnknownCovers } from "./findUnknownCovers";

type CoverageInput = {
	inventoryIds: string[];
	internal?: ReadonlyMap<string, string>;
	pages: DocsPage[];
};

export function checkDocsCoverage({
	inventoryIds,
	internal = new Map(),
	pages,
}: CoverageInput): (string | undefined)[] {
	const inventory = new Set(inventoryIds);
	const covered = new Set(pages.flatMap((page) => page.covers));

	return [
		verifySection(
			"Items documented by no page (add them to a docs page's covers)",
			inventoryIds.filter((id) => !covered.has(id)),
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
	];
}
