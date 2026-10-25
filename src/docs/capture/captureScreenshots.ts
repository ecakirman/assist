import { rmSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import type { CaptureSetupStep } from "../captureSetupStepSchema";
import type { DocsScreenshot } from "../docsPageSchema";
import type { CaptureScenes } from "../loadCaptureScenes";
import { captureScreenshot } from "./captureScreenshot";
import type { CaptureHome } from "./createCaptureHome";
import { runAssist } from "./runAssist";
import { runSetupStep } from "./runSetupStep";

function setupSteps(
	screenshot: DocsScreenshot,
	scenes: CaptureScenes,
): CaptureSetupStep[] {
	const scene = screenshot.scene ? (scenes[screenshot.scene] ?? []) : [];
	return [...scene, ...(screenshot.setup ?? [])];
}

function sessionStateTracker(capture: CaptureHome) {
	let current = "[]";
	return async (steps: CaptureSetupStep[]) => {
		const next = JSON.stringify(steps);
		if (next === current) return;
		if (current !== "[]") {
			runAssist(capture, ["daemon", "drain", "--yes"]);
			rmSync(join(capture.home, ".claude", "projects"), {
				recursive: true,
				force: true,
			});
		}
		for (const step of steps) await runSetupStep(capture, step);
		current = next;
	};
}

export async function captureScreenshots(
	capture: CaptureHome,
	url: string,
	screenshots: DocsScreenshot[],
	scenes: CaptureScenes,
): Promise<void> {
	const browser = await chromium.launch();
	const enterState = sessionStateTracker(capture);
	try {
		for (const screenshot of screenshots) {
			await enterState(setupSteps(screenshot, scenes));
			const files = await captureScreenshot(browser, url, screenshot);
			console.log(`Captured ${files.join(", ")}`);
		}
	} finally {
		await browser.close();
	}
}
