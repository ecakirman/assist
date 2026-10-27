import type { Page } from "playwright";
import type { DocsScreenshot } from "../docsPageSchema";
import { unionClip } from "./unionClip";

export async function saveScreenshot(
	page: Page,
	{ crop, cropPadding }: Pick<DocsScreenshot, "crop" | "cropPadding">,
	path: string,
): Promise<void> {
	const options = { path, animations: "disabled" as const };
	if (!crop) {
		await page.screenshot(options);
		return;
	}
	if (typeof crop === "string" && !cropPadding) {
		await page.locator(crop).screenshot(options);
		return;
	}
	const selectors = typeof crop === "string" ? [crop] : crop;
	await page.locator(selectors[0]).first().scrollIntoViewIfNeeded();
	const clip = await unionClip(page, selectors, cropPadding ?? 0);
	await page.screenshot({ ...options, clip });
}
