import { docsFeedbackMarkers } from "../../../shared/docsFeedbackMarkers";
import { answerBrowserProbes } from "../browserLink/answerBrowserProbes";
import { watchDocsSelection } from "./watchDocsSelection";

export function docsContentScript(): void {
	answerBrowserProbes();
	if (document.querySelector(`meta[name="${docsFeedbackMarkers.pageMeta}"]`))
		watchDocsSelection();
}

docsContentScript();
