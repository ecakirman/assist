import type {
	HighLevelTestCase,
	HighLevelTestFile,
	HighLevelTestNode,
} from "./types";
import { type ShownForm, shownForm } from "./shownForm";

const MAX_TOTAL_SOURCE_LINES = 5000;

function collectCases(nodes: HighLevelTestNode[]): HighLevelTestCase[] {
	return nodes.flatMap((node) =>
		node.kind === "it" ? [node] : collectCases(node.children),
	);
}

function shippedForms(
	files: HighLevelTestFile[],
): Map<HighLevelTestCase, ShownForm> {
	const sized = files
		.flatMap((file) => collectCases(file.tests))
		.flatMap((test) => {
			const form = shownForm(test);
			return form ? [{ test, form }] : [];
		})
		.sort((a, b) => a.form.lines - b.form.lines);
	const shipped = new Map<HighLevelTestCase, ShownForm>();
	let remaining = MAX_TOTAL_SOURCE_LINES;
	for (const { test, form } of sized) {
		if (form.lines > remaining) break;
		remaining -= form.lines;
		shipped.set(test, form);
	}
	return shipped;
}

export function capHighLevelTestSources(
	files: HighLevelTestFile[],
): HighLevelTestFile[] {
	const shipped = shippedForms(files);

	const capCase = (test: HighLevelTestCase): HighLevelTestCase => {
		const form = shipped.get(test);
		if (form) return form.shown;
		const { source, changedLines: _changedLines, ...rest } = test;
		if (source === undefined) return rest;
		return shownForm(test)
			? { ...rest, overBudget: true }
			: { ...rest, truncated: true };
	};

	const capNode = (node: HighLevelTestNode): HighLevelTestNode =>
		node.kind === "it"
			? capCase(node)
			: { ...node, children: node.children.map(capNode) };

	return files.map((file) => ({ ...file, tests: file.tests.map(capNode) }));
}
