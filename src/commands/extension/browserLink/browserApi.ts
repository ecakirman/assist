import type { BrowserTab } from "./pickTargetTab";

type Listener<T> = { addListener: (listener: (value: T) => void) => void };

type BrowserApi = {
	runtime: { getManifest: () => { version: string } };
	tabs: {
		query: (filter: Record<string, unknown>) => Promise<BrowserTab[]>;
		sendMessage: (tabId: number, message: unknown) => Promise<unknown>;
	};
	windows?: { getLastFocused: () => Promise<{ id?: number }> };
	alarms?: {
		create: (name: string, info: { periodInMinutes: number }) => void;
		onAlarm: Listener<{ name: string }>;
	};
	storage?: { onChanged: Listener<Record<string, unknown>> };
};

export function browserApi(): BrowserApi | undefined {
	const api = (globalThis as { browser?: Partial<BrowserApi> }).browser;
	return api?.runtime && api.tabs ? (api as BrowserApi) : undefined;
}
