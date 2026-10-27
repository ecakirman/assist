import type { Page } from "playwright";

type Clip = { x: number; y: number; width: number; height: number };

export async function unionClip(
	page: Page,
	selectors: string[],
	padding: number,
): Promise<Clip> {
	const boxes: Clip[] = [];
	for (const selector of selectors) {
		const box = await page.locator(selector).first().boundingBox();
		if (!box) throw new Error(`Crop selector ${selector} is not visible`);
		boxes.push(box);
	}
	const left = Math.max(0, Math.min(...boxes.map((b) => b.x)) - padding);
	const top = Math.max(0, Math.min(...boxes.map((b) => b.y)) - padding);
	const right = Math.max(...boxes.map((b) => b.x + b.width)) + padding;
	const bottom = Math.max(...boxes.map((b) => b.y + b.height)) + padding;
	return { x: left, y: top, width: right - left, height: bottom - top };
}
