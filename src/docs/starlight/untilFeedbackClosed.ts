import { docsFeedbackMarkers } from "../../shared/docsFeedbackMarkers";

export function untilFeedbackClosed(doc: Document): Promise<void> {
	const open = () => doc.querySelector(docsFeedbackMarkers.popover) !== null;
	if (!open()) return Promise.resolve();
	return new Promise((resolve) => {
		new MutationObserver((_, observer) => {
			if (open()) return;
			observer.disconnect();
			resolve();
		}).observe(doc.documentElement, { childList: true, subtree: true });
	});
}
