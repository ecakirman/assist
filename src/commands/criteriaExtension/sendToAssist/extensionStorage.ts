type StorageArea = {
	get: (key: string) => Promise<Record<string, unknown>>;
	set: (items: Record<string, unknown>) => Promise<void>;
};

type ExtensionGlobal = { browser?: { storage?: { local?: StorageArea } } };

export function extensionStorage(): StorageArea | undefined {
	return (globalThis as ExtensionGlobal).browser?.storage?.local;
}
