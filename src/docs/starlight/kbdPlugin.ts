import { renderKbd } from "./renderKbd";

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

export const kbdPlugin = {
	name: "assist-docs-kbd",
	textDirective(node: TextDirective, ctx: VisitorContext) {
		if (node.name !== "kbd") return;
		const chord = textOf(node).trim();
		if (!chord) throw new Error(":kbd[] needs a chord such as :kbd[Mod+N]");
		ctx.replaceNode(node, { type: "html", value: renderKbd(chord) });
	},
};
