import { extensionRuntime } from "./extensionRuntime";

const ICON_PATH = "icons/assist-32.png";

export function assistIcon(): HTMLImageElement | undefined {
	const src = extensionRuntime()?.getURL?.(ICON_PATH);
	if (!src) return undefined;
	const icon = document.createElement("img");
	icon.src = src;
	icon.alt = "";
	return icon;
}
