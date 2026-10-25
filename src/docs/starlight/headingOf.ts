export type HastNode = {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

export function headingOf(node: HastNode): HastNode | undefined {
	if (isElement(node, "h2")) return node;
	if (!isHeadingWrapper(node)) return undefined;
	return node.children?.find((child) => isElement(child, "h2"));
}

function isElement(node: HastNode, tagName: string): boolean {
	return node.type === "element" && node.tagName === tagName;
}

function isHeadingWrapper(node: HastNode): boolean {
	const className = node.properties?.className;
	return (
		isElement(node, "div") &&
		Array.isArray(className) &&
		className.includes("sl-heading-wrapper")
	);
}
