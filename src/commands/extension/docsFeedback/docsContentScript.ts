import { docsFeedbackMarkers } from "../../../shared/docsFeedbackMarkers";
import { watchDocsSelection } from "./watchDocsSelection";

export function docsContentScript(): void {
	if (document.querySelector(`meta[name="${docsFeedbackMarkers.pageMeta}"]`))
		watchDocsSelection();
}

docsContentScript();
