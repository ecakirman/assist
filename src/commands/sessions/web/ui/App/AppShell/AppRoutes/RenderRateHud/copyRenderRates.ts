import { swatches } from "../../../../designSystem/swatches";

const FLASH_MS = 600;

export function copyRenderRates(
	element: HTMLElement | null,
	text: string,
): void {
	if (!element || !text) return;
	void navigator.clipboard?.writeText(text);
	const previous = element.style.outline;
	element.style.outline = `2px solid ${swatches.renderHud.text}`;
	setTimeout(() => {
		element.style.outline = previous;
	}, FLASH_MS);
}
