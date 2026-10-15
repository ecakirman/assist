type ExtensionRuntime = {
	sendMessage: (message: unknown) => Promise<unknown>;
	onMessage: {
		addListener: (listener: (message: unknown) => unknown) => void;
	};
};

type ExtensionGlobal = { browser?: { runtime?: ExtensionRuntime } };

export function extensionRuntime(): ExtensionRuntime | undefined {
	return (globalThis as ExtensionGlobal).browser?.runtime;
}
