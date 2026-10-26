import { docsFeedbackMarkers } from "../../shared/docsFeedbackMarkers";

type PreviewPage = { id: string; title: string; source: string };

function meta(name: string, content: string) {
	return { tag: "meta" as const, attrs: { name, content }, content: "" };
}

export function previewPageMeta(page: PreviewPage) {
	return [
		meta(docsFeedbackMarkers.pageMeta, page.id),
		meta(docsFeedbackMarkers.titleMeta, page.title),
		meta(docsFeedbackMarkers.sourceMeta, page.source),
	];
}
