import { docsFeedbackMarkers } from "../../shared/docsFeedbackMarkers";
import type { DocsPage } from "../docsPageSchema";
import type { DocsPreviewStamp } from "./DocsPreviewStamp";
import { escapeHtml } from "./escapeHtml";

export function previewMeta(page: DocsPage, stamp: DocsPreviewStamp): string {
	const { pageMeta, sessionMeta } = docsFeedbackMarkers;
	const meta = [`<meta name="${pageMeta}" content="${escapeHtml(page.id)}">`];
	if (stamp.sessionId)
		meta.push(
			`<meta name="${sessionMeta}" content="${escapeHtml(stamp.sessionId)}">`,
		);
	return `${meta.join("\n")}\n`;
}
