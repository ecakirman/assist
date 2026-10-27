import { copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import type { CaptureSetupStep } from "../captureSetupStepSchema";
import type { DocsScreenshot } from "../docsPageSchema";
import { docsPaths } from "../docsPaths";
import type { CaptureScenes } from "../loadCaptureScenes";
import { captureScreenshot } from "./captureScreenshot";
import { closePreviews } from "./closePreviews";
import type { CaptureHome } from "./createCaptureHome";
import { resetBacklog } from "./resetBacklog";
import { resetPeers } from "./resetPeers";
import { runAssist } from "./runAssist";
import { runSetupStep } from "./runSetupStep";
import { fakeGhResponsesFile } from "./writeFakeGhResponse";

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
			closePreviews(capture);
			runAssist(capture, ["daemon", "drain", "--yes"]);
			resetPeers(capture);
			rmSync(join(capture.home, ".claude", "projects"), {
				recursive: true,
				force: true,
			});
			rmSync(join(capture.home, ".fake-gh.json"), { force: true });
			rmSync(fakeGhResponsesFile(capture), { force: true });
			copyFileSync(docsPaths.captureConfig, join(capture.home, ".assist.yml"));
			await resetBacklog(capture);
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
		closePreviews(capture);
		await browser.close();
	}
}
