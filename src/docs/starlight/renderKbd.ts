import { escapeHtml } from "./escapeHtml";

const platformKeys: Record<string, { mac: string; other: string }> = {
	Mod: { mac: "⌘", other: "Ctrl" },
	Ctrl: { mac: "⌃", other: "Ctrl" },
	Alt: { mac: "⌥", other: "Alt" },
	Shift: { mac: "⇧", other: "Shift" },
};

function renderKey(key: string): string {
	const platform = platformKeys[key];
	if (!platform) return `<kbd>${escapeHtml(key)}</kbd>`;
	return `<kbd><span class="assist-kbd-mac">${platform.mac}</span><span class="assist-kbd-other">${platform.other}</span></kbd>`;
}

export function renderKbd(chord: string): string {
	const keys = chord.split("+").map((key) => renderKey(key.trim()));
	return `<kbd class="assist-kbd">${keys.join("")}</kbd>`;
}
