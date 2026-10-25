type MdastNode = { value?: string; children?: MdastNode[] };

type TextDirective = MdastNode & { name: string };

type VisitorContext = {
	replaceNode(
		node: TextDirective,
		replacement: { type: "html"; value: string },
	): void;
};

function textOf(node: MdastNode): string {
	return node.value ?? (node.children ?? []).map(textOf).join("");
}

export function createTextDirectivePlugin(
	directive: string,
	render: (label: string) => string,
) {
	return {
		name: `assist-docs-${directive}`,
		textDirective(node: TextDirective, ctx: VisitorContext) {
			if (node.name !== directive) return;
			ctx.replaceNode(node, {
				type: "html",
				value: render(textOf(node).trim()),
			});
		},
	};
}
