import type { Page } from "playwright";

const PADDING = 4;

export async function drawHighlights(
	page: Page,
	selectors: string[],
): Promise<void> {
	for (const selector of selectors) {
		const elements = await page.locator(selector).all();
		if (elements.length === 0)
			throw new Error(`highlight matched nothing: ${selector}`);
		for (const element of elements) {
			const box = await element.boundingBox();
			if (!box) continue;
			await page.evaluate(
				({ x, y, width, height, padding }) => {
					const ring = document.createElement("div");
					Object.assign(ring.style, {
						position: "fixed",
						left: `${x - padding}px`,
						top: `${y - padding}px`,
						width: `${width + padding * 2}px`,
						height: `${height + padding * 2}px`,
						border: "3px solid #e91e63",
						borderRadius: "6px",
						boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.6)",
						pointerEvents: "none",
						zIndex: "2147483647",
						boxSizing: "border-box",
					});
					document.body.appendChild(ring);
				},
				{ ...box, padding: PADDING },
			);
		}
	}
}
