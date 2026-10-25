import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { docsFeedbackMarkers } from "../../shared/docsFeedbackMarkers";
import { docsPaths } from "../docsPaths";
import { type HastNode, headingOf } from "./headingOf";

type HastRoot = { type: "root"; children: HastNode[] };

type HookContext = {
	textContent(node: HastNode): string;
	replaceNode(node: HastRoot, replacement: HastRoot): void;
};

function section(heading: string, source: string): Required<HastNode> {
	return {
		type: "element",
		tagName: "section",
		properties: {
			[docsFeedbackMarkers.headingAttribute]: heading,
			[docsFeedbackMarkers.sourceAttribute]: source,
		},
		children: [],
	};
}

export function docsSectionsPlugin() {
	return ({ fileURL }: { fileURL: URL | undefined }) => {
		const path = fileURL && fileURLToPath(fileURL);
		if (!path?.startsWith(docsPaths.pagesDir)) return undefined;
		const source = relative(docsPaths.repoRoot, path);
		return {
			name: "assist-docs-sections",
			after(root: HastRoot, ctx: HookContext) {
				const children: HastNode[] = [];
				let current: Required<HastNode> | undefined;
				for (const child of root.children) {
					const heading = headingOf(child);
					if (heading) {
						current = section(ctx.textContent(heading), source);
						children.push(current);
					}
					if (current) current.children.push(child);
					else children.push(child);
				}
				ctx.replaceNode(root, { type: "root", children });
			},
		};
	};
}
