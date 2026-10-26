import type { Page } from "playwright";

const WAIT_FOR_SMOOTH_SCROLL_MS = 1000;

async function boxOf(page: Page, selector: string) {
	const box = await page.locator(selector).first().boundingBox();
	if (!box) throw new Error(`drag target is not visible: ${selector}`);
	return box;
}

export async function dragBetween(
	page: Page,
	from: string,
	to: string,
): Promise<void> {
	await page.waitForTimeout(WAIT_FOR_SMOOTH_SCROLL_MS);
	const start = await boxOf(page, from);
	const end = await boxOf(page, to);
	await page.mouse.move(start.x + 1, start.y + start.height / 2);
	await page.mouse.down();
	await page.mouse.move(end.x + end.width - 1, end.y + end.height / 2, {
		steps: 10,
	});
	await page.mouse.up();
}
