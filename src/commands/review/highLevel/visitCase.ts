import type { CallExpression } from "ts-morph";
import type { HighLevelTestCase, HighLevelTestNode } from "./types";
import { dedentedSource } from "./dedentedSource";
import { testName } from "./testName";

type Context = { path: string; changed?: Set<number> };

export function visitCase(
	call: CallExpression,
	context: Context,
): HighLevelTestNode[] {
	if (!context.changed) return [toCase(call, context, undefined)];
	const count = changedLines(call, context.changed);
	if (count === 0) return [];
	const lines = call.getEndLineNumber() - call.getStartLineNumber() + 1;
	return [toCase(call, context, count === lines ? "added" : "modified")];
}

function toCase(
	call: CallExpression,
	context: Context,
	change: HighLevelTestCase["change"],
): HighLevelTestCase {
	const line = call.getStartLineNumber();
	return {
		kind: "it",
		id: `${context.path}:${line}`,
		name: testName(call),
		line,
		...(change ? { change } : {}),
		source: dedentedSource(call),
	};
}

function changedLines(call: CallExpression, changed: Set<number>): number {
	let count = 0;
	for (
		let line = call.getStartLineNumber();
		line <= call.getEndLineNumber();
		line++
	)
		if (changed.has(line)) count++;
	return count;
}
