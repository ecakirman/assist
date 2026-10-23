import type {
	HighLevelTestCase,
	HighLevelTestFile,
	HighLevelTestNode,
} from "./types";

const MAX_TEST_SOURCE_LINES = 200;
const MAX_TOTAL_SOURCE_LINES = 5000;

function collectCases(nodes: HighLevelTestNode[]): HighLevelTestCase[] {
	return nodes.flatMap((node) =>
		node.kind === "it" ? [node] : collectCases(node.children),
	);
}

function shippedCases(files: HighLevelTestFile[]): Set<HighLevelTestCase> {
	const sized = files
		.flatMap((file) => collectCases(file.tests))
		.flatMap((test) =>
			test.source === undefined
				? []
				: [{ test, lines: test.source.split("\n").length }],
		)
		.filter(({ lines }) => lines <= MAX_TEST_SOURCE_LINES)
		.sort((a, b) => a.lines - b.lines);
	const shipped = new Set<HighLevelTestCase>();
	let remaining = MAX_TOTAL_SOURCE_LINES;
	for (const { test, lines } of sized) {
		if (lines > remaining) break;
		remaining -= lines;
		shipped.add(test);
	}
	return shipped;
}

export function capHighLevelTestSources(
	files: HighLevelTestFile[],
): HighLevelTestFile[] {
	const shipped = shippedCases(files);

	const capCase = (test: HighLevelTestCase): HighLevelTestCase => {
		if (test.source === undefined || shipped.has(test)) return test;
		const { source, ...rest } = test;
		return source.split("\n").length > MAX_TEST_SOURCE_LINES
			? { ...rest, truncated: true }
			: { ...rest, overBudget: true };
	};

	const capNode = (node: HighLevelTestNode): HighLevelTestNode =>
		node.kind === "it"
			? capCase(node)
			: { ...node, children: node.children.map(capNode) };

	return files.map((file) => ({ ...file, tests: file.tests.map(capNode) }));
}
