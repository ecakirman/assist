import { reportVerifyProblems } from "../commands/verify/reportVerifyProblems";
import { checkDocsCoverage } from "./checkDocsCoverage";
import { docsPaths } from "./docsPaths";
import { formatPendingReport } from "./formatPendingReport";
import { collectDocsInventory } from "./inventory/collectDocsInventory";
import { loadDocsPages } from "./loadDocsPages";
import { pendingUserDocumentation } from "./pendingUserDocumentation";

export function docsCoverage(report: boolean): never {
	const inventory = collectDocsInventory();
	if (report) {
		console.log(formatPendingReport(inventory, pendingUserDocumentation));
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
			pages: loadDocsPages(docsPaths.pagesDir),
			pending: pendingUserDocumentation,
		}),
		`All ${inventory.length} commands, skills, config keys and routes are documented or pending documentation.`,
	);
}

docsCoverage(process.argv.includes("--report"));
