import { docsFeedbackMarkers } from "../../shared/docsFeedbackMarkers";

export function previewPageMeta(pageId: string) {
	return {
		tag: "meta" as const,
		attrs: { name: docsFeedbackMarkers.pageMeta, content: pageId },
		content: "",
	};
}
