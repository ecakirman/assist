import { extensionRuntime } from "../sendToAssist/extensionRuntime";
import { inspectPage } from "./inspectPage";
import {
	BROWSER_PROBE_TYPE,
	type BrowserRequest,
	type ProbeAnswer,
} from "./types";

function answerProbe(request: BrowserRequest): ProbeAnswer {
	try {
		if (request.op === "snapshot")
			return {
				running: true,
				result: { html: document.documentElement.outerHTML },
			};
		if (request.op === "inspect")
			return { running: true, result: inspectPage(document, request) };
		return { running: true };
	} catch (error) {
		return {
			running: true,
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

export function answerBrowserProbes(): void {
	extensionRuntime()?.onMessage.addListener((message) => {
		const probe = message as ({ type?: unknown } & BrowserRequest) | undefined;
		if (probe?.type !== BROWSER_PROBE_TYPE) return undefined;
		return Promise.resolve(answerProbe(probe));
	});
}
