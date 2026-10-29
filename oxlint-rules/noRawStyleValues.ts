type AstNode = {
	type: string;
	name?: string;
	value?: unknown;
	key?: AstNode;
	computed?: boolean;
	quasis?: { value: { cooked: string | null; raw: string } }[];
};

type RuleContext = {
	report: (diagnostic: {
		node: AstNode;
		messageId: string;
		data?: Record<string, string>;
	}) => void;
};

const hexColour = /(?<![\w/&])#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{3,4})\b/i;
const colourFunction = /\b(?:rgba?|hsla?)\(/i;
const fontStack =
	/,\s*["']?(?:monospace|sans-serif|serif|system-ui|ui-monospace|ui-sans-serif)\b/i;
const themeFontKeys = new Set(["fontFamilyMono", "inherit"]);

const isFontFamilyKey = (key: AstNode | undefined): boolean =>
	key?.name === "fontFamily" || key?.value === "fontFamily";

const templateText = (node: AstNode): string =>
	(node.quasis ?? []).map((quasi) => quasi.value.cooked ?? "").join("${}");

export const noRawStyleValues = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Reject raw colour literals and font-family stacks outside the design system; style through the theme and design tokens.",
		},
		messages: {
			colour:
				"Raw colour '{{value}}' — use a theme palette path or a design token from designSystem/.",
			fontStack:
				"Raw font family '{{value}}' — use fontFamily: \"fontFamilyMono\" or the theme's font tokens.",
		},
		schema: [],
	},
	create(context: RuleContext) {
		const checkText = (node: AstNode, text: string): void => {
			const colour = hexColour.exec(text) ?? colourFunction.exec(text);
			if (colour) {
				context.report({
					node,
					messageId: "colour",
					data: { value: text },
				});
				return;
			}
			if (fontStack.test(text)) {
				context.report({
					node,
					messageId: "fontStack",
					data: { value: text },
				});
			}
		};

		return {
			Literal(node: AstNode) {
				if (typeof node.value === "string") checkText(node, node.value);
			},
			TemplateLiteral(node: AstNode) {
				checkText(node, templateText(node));
			},
			Property(node: AstNode & { value?: AstNode }) {
				if (node.computed || !isFontFamilyKey(node.key)) return;
				const value = node.value;
				if (value?.type !== "Literal" && value?.type !== "TemplateLiteral")
					return;
				const text =
					value.type === "Literal" ? String(value.value) : templateText(value);
				if (themeFontKeys.has(text) || fontStack.test(text)) return;
				context.report({
					node: value,
					messageId: "fontStack",
					data: { value: text },
				});
			},
		};
	},
};

export default {
	meta: { name: "design" },
	rules: { "no-raw-style-values": noRawStyleValues },
};
