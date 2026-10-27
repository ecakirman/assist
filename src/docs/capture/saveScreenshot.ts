import type { Page } from "playwright";
import type { DocsScreenshot } from "../docsPageSchema";
import { unionClip } from "./unionClip";

export async function saveScreenshot(
	page: Page,
	crop: DocsScreenshot["crop"],
	path: string,
): Promise<void> {
	const options = { path, animations: "disabled" as const };
	if (Array.isArray(crop))
		await page.screenshot({ ...options, clip: await unionClip(page, crop) });
	else await (crop ? page.locator(crop) : page).screenshot(options);
}
