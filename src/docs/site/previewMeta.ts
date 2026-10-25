import { docsFeedbackMarkers } from "../../shared/docsFeedbackMarkers";
import type { DocsPage } from "../docsPageSchema";
import { escapeHtml } from "./escapeHtml";

export function previewMeta(page: DocsPage): string {
	return `<meta name="${docsFeedbackMarkers.pageMeta}" content="${escapeHtml(page.id)}">\n`;
}
