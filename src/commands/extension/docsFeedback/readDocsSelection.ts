import { docsFeedbackMarkers } from "../../../shared/docsFeedbackMarkers";
import type { DocsFeedback } from "../../sessions/web/docsFeedback/docsFeedbackSchema";

export type DocsSelection = Omit<DocsFeedback, "prompt"> & { range: Range };

function metaContent(doc: Document, name: string): string | undefined {
	return (
		doc.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content ||
		undefined
	);
}

function sectionOf(node: Node | null): Element | null | undefined {
	const element = node instanceof Element ? node : node?.parentElement;
	return element?.closest(`section[${docsFeedbackMarkers.headingAttribute}]`);
}

export function readDocsSelection(
	doc: Document,
	selection: Selection | null,
): DocsSelection | undefined {
	const pageId = metaContent(doc, docsFeedbackMarkers.pageMeta);
	if (!pageId || !selection || selection.isCollapsed) return undefined;
	const text = selection.toString().trim();
	if (!text || selection.rangeCount === 0) return undefined;
	const range = selection.getRangeAt(0);
	const section = sectionOf(range.startContainer);
	if (!section) return undefined;
	return {
		pageId,
		heading: section.getAttribute(docsFeedbackMarkers.headingAttribute) ?? "",
		source: section.getAttribute(docsFeedbackMarkers.sourceAttribute) ?? "",
		selection: text,
		range,
	};
}
