import { reportVerifyProblems } from "../commands/verify/reportVerifyProblems";
import { checkDocsCoverage } from "./checkDocsCoverage";
import { docsPaths } from "./docsPaths";
import { formatUncoveredReport } from "./formatUncoveredReport";
import { collectDocsInventory } from "./inventory/collectDocsInventory";
import { loadDocsPages } from "./loadDocsPages";

export function docsCoverage(report: boolean): never {
	const inventory = collectDocsInventory();
	const pages = loadDocsPages(docsPaths.pagesDir);
	if (report) {
		console.log(
			formatUncoveredReport(
				inventory,
				new Set(pages.flatMap((page) => page.covers)),
			),
		);
		process.exit(0);
	}
	reportVerifyProblems(
		checkDocsCoverage({
			inventoryIds: inventory.map((item) => item.id),
			internal: new Map(
				inventory.flatMap(({ id, internalCalledBy }) =>
					internalCalledBy ? [[id, internalCalledBy] as const] : [],
				),
			),
			pages,
		}),
		`All ${inventory.length} commands, skills, config keys and routes are documented.`,
	);
}

docsCoverage(process.argv.includes("--report"));
