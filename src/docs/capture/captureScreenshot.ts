import { join } from "node:path";
import type { Browser, Page } from "playwright";
import type { DocsScreenshot, DocsScreenshotAction } from "../docsPageSchema";
import { docsPaths } from "../docsPaths";
import { screenshotVariants } from "../screenshotVariants";

const DEFAULT_VIEWPORT = { width: 1280, height: 800 };
const SETTLE_MS = 750;

async function performAction(
	page: Page,
	action: DocsScreenshotAction,
): Promise<void> {
	if ("click" in action) await page.locator(action.click).first().click();
	else if ("press" in action) await page.keyboard.press(action.press);
	else await page.keyboard.type(action.type);
}

export async function captureScreenshot(
	browser: Browser,
	baseUrl: string,
	screenshot: DocsScreenshot,
): Promise<string[]> {
	const written: string[] = [];
	for (const variant of screenshotVariants(screenshot)) {
		const context = await browser.newContext({
			viewport: screenshot.viewport ?? DEFAULT_VIEWPORT,
			colorScheme: variant.theme,
		});
		await context.addInitScript((mode) => {
			localStorage.setItem("theme-mode", mode);
		}, variant.theme);
		const page = await context.newPage();
		await page.goto(`${baseUrl}${screenshot.route}`, { waitUntil: "load" });
		if (screenshot.waitFor) await page.waitForSelector(screenshot.waitFor);
		for (const action of screenshot.actions ?? [])
			await performAction(page, action);
		await page.waitForTimeout(SETTLE_MS);
		const target = screenshot.crop ? page.locator(screenshot.crop) : page;
		await target.screenshot({
			path: join(docsPaths.screenshotsDir, variant.file),
			animations: "disabled",
		});
		await context.close();
		written.push(variant.file);
	}
	return written;
}
