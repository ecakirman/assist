import { docsFeedbackMarkers } from "../../shared/docsFeedbackMarkers";
import type { DocsPage } from "../docsPageSchema";
import { escapeHtml } from "./escapeHtml";

type Section = DocsPage["sections"][number];

export function sectionAttributes(
	section: Section,
	source: string | undefined,
): string {
	const { headingAttribute, sourceAttribute } = docsFeedbackMarkers;
	const heading = ` ${headingAttribute}="${escapeHtml(section.heading)}"`;
	return source
		? `${heading} ${sourceAttribute}="${escapeHtml(source)}"`
		: heading;
}
