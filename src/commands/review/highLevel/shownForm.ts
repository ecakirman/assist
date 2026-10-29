import { testChangeExcerpts } from "./testChangeExcerpts";
import type { HighLevelTestCase } from "./types";

export type ShownForm = { lines: number; shown: HighLevelTestCase };

const MAX_TEST_SOURCE_LINES = 200;

export function shownForm(test: HighLevelTestCase): ShownForm | undefined {
	const { source, changedLines, ...rest } = test;
	if (source === undefined) return undefined;
	const lines = lineCount(source);
	if (lines <= MAX_TEST_SOURCE_LINES)
		return { lines, shown: { ...rest, source } };
	if (!changedLines) return undefined;
	const excerpts = testChangeExcerpts(source, test.line, changedLines);
	const excerptLines = excerpts.reduce(
		(sum, excerpt) => sum + lineCount(excerpt.source),
		0,
	);
	return excerptLines <= MAX_TEST_SOURCE_LINES
		? { lines: excerptLines, shown: { ...rest, excerpts } }
		: undefined;
}

function lineCount(text: string): number {
	return text.split("\n").length;
}
