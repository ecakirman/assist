import { describeElement } from "./describeElement";
import type { InspectMatch, InspectQuery, InspectResult } from "./types";

export const MAX_INSPECT_MATCHES = 20;
const MAX_TEXT_LENGTH = 80;
const SKIPPED_TEXT_PARENTS = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);

function ancestorChain(element: Element): string[] {
	const chain: string[] = [];
	for (let node: Element | null = element; node; node = node.parentElement)
		chain.unshift(describeElement(node));
	return chain;
}

function shortText(element: Element): string {
	const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
	return text.length > MAX_TEXT_LENGTH
		? `${text.slice(0, MAX_TEXT_LENGTH)}…`
		: text;
}

function elementsContainingText(root: Document, text: string): Element[] {
	const found = new Set<Element>();
	const walker = root.createTreeWalker(root.body ?? root, NodeFilter.SHOW_TEXT);
	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		const parent = node.parentElement;
		if (
			parent &&
			!SKIPPED_TEXT_PARENTS.has(parent.tagName) &&
			node.nodeValue?.includes(text)
		)
			found.add(parent);
	}
	return [...found];
}

function toMatch(element: Element): InspectMatch {
	const { width, height } = element.getBoundingClientRect();
	return {
		chain: ancestorChain(element),
		text: shortText(element),
		width: Math.round(width),
		height: Math.round(height),
	};
}

export function inspectPage(
	root: Document,
	query: InspectQuery,
): InspectResult {
	const elements =
		"selector" in query
			? [...root.querySelectorAll(query.selector)]
			: elementsContainingText(root, query.text);
	return {
		matches: elements.slice(0, MAX_INSPECT_MATCHES).map(toMatch),
		total: elements.length,
	};
}
