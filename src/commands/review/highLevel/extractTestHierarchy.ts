import { Node, Project } from "ts-morph";
import { classifyTestCall } from "./classifyTestCall";
import type { HighLevelTestNode } from "./types";
import { testName } from "./testName";
import { visitCase } from "./visitCase";

type Context = { path: string; changed?: Set<number> };

function collect(node: Node, context: Context): HighLevelTestNode[] {
	const found: HighLevelTestNode[] = [];
	node.forEachChild((child) => {
		found.push(...visit(child, context));
	});
	return found;
}

function visit(node: Node, context: Context): HighLevelTestNode[] {
	if (!Node.isCallExpression(node)) return collect(node, context);
	const kind = classifyTestCall(node);
	if (kind === "it") return visitCase(node, context);
	if (kind === undefined) return collect(node, context);
	const children = node
		.getArguments()
		.slice(1)
		.flatMap((argument) => visit(argument, context));
	if (children.length === 0) return [];
	return [
		{
			kind: "describe",
			name: testName(node),
			line: node.getStartLineNumber(),
			children,
		},
	];
}

export function extractTestHierarchy(
	path: string,
	text: string,
	changed?: Set<number>,
): HighLevelTestNode[] {
	const project = new Project({
		useInMemoryFileSystem: true,
		compilerOptions: { allowJs: true },
	});
	const source = project.createSourceFile(`/${path}`, text);
	return collect(source, { path, ...(changed ? { changed } : {}) });
}
