import { untilFeedbackClosed } from "./untilFeedbackClosed";

type HotListeners = {
	on(event: string, listener: () => Promise<void>): void;
};

const reloadEvents = ["vite:beforeFullReload", "vite:ws:disconnect"];

export function holdReloadsForFeedback(hot: HotListeners, doc: Document): void {
	for (const event of reloadEvents)
		hot.on(event, () => untilFeedbackClosed(doc));
}
