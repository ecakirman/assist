import { extensionRuntime } from "../sendToAssist/extensionRuntime";
import { BROWSER_PROBE_TYPE } from "./types";

export function answerBrowserProbes(): void {
	extensionRuntime()?.onMessage.addListener((message) => {
		if (
			(message as { type?: unknown } | undefined)?.type !== BROWSER_PROBE_TYPE
		)
			return undefined;
		return Promise.resolve({ running: true });
	});
}
