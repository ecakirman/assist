import { chromium } from "playwright";
import type { DocsScreenshot } from "../docsPageSchema";
import { captureScreenshot } from "./captureScreenshot";
import type { CaptureHome } from "./createCaptureHome";
import { runSetupStep } from "./runSetupStep";

export async function captureScreenshots(
	capture: CaptureHome,
	url: string,
	screenshots: DocsScreenshot[],
): Promise<void> {
	const browser = await chromium.launch();
	try {
		for (const screenshot of screenshots) {
			for (const step of screenshot.setup ?? [])
				await runSetupStep(capture, step);
			const files = await captureScreenshot(browser, url, screenshot);
			console.log(`Captured ${files.join(", ")}`);
		}
	} finally {
		await browser.close();
	}
}
