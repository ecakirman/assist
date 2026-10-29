import type { CallExpression } from "ts-morph";
import type { HighLevelTestCase, HighLevelTestNode } from "./types";
import { dedentedSource } from "./dedentedSource";
import { testName } from "./testName";

type Context = { path: string; changed?: Set<number> };

export function visitCase(
	call: CallExpression,
	context: Context,
): HighLevelTestNode[] {
	if (!context.changed) return [toCase(call, context)];
	const lines = changedLines(call, context.changed);
	if (lines.length === 0) return [];
	const total = call.getEndLineNumber() - call.getStartLineNumber() + 1;
	return [
		toCase(
			call,
			context,
			lines.length === total
				? { change: "added" }
				: { change: "modified", changedLines: lines },
		),
	];
}

function toCase(
	call: CallExpression,
	context: Context,
	change: Pick<HighLevelTestCase, "change" | "changedLines"> = {},
): HighLevelTestCase {
	const line = call.getStartLineNumber();
	return {
		kind: "it",
		id: `${context.path}:${line}`,
		name: testName(call),
		line,
		...change,
		source: dedentedSource(call),
	};
}

function changedLines(call: CallExpression, changed: Set<number>): number[] {
	const lines: number[] = [];
	for (
		let line = call.getStartLineNumber();
		line <= call.getEndLineNumber();
		line++
	)
		if (changed.has(line)) lines.push(line);
	return lines;
}
