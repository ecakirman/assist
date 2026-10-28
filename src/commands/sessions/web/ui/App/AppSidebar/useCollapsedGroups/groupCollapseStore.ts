const STORAGE_KEY = "assist:group-collapse";

type GroupCollapseChoice = { collapsedAt: number } | { openedAt: number };

type GroupCollapseChoices = Record<string, GroupCollapseChoice>;

const listeners = new Set<() => void>();

function readRaw(): string {
	try {
		return localStorage.getItem(STORAGE_KEY) ?? "";
	} catch {
		return "";
	}
}

function parseChoices(raw: string): GroupCollapseChoices {
	if (!raw) return {};
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		return Object.fromEntries(
			Object.entries(parsed).filter(
				([, choice]) => choice && typeof choice === "object",
			),
		);
	} catch {
		return {};
	}
}

function setChoice(key: string, choice: GroupCollapseChoice): void {
	const next = { ...parseChoices(readRaw()), [key]: choice };
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	} catch {}
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export const groupCollapseStore = {
	getRaw: readRaw,
	parse: parseChoices,
	setChoice,
	subscribe,
};
