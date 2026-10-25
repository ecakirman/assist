import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CaptureTranscriptStep } from "../captureSetupStepSchema";
import { buildTranscript, claudeProjectDirName } from "./buildTranscript";
import type { CaptureHome } from "./createCaptureHome";

function saveTitle(home: string, sessionId: string, title: string): void {
	const dir = join(home, ".assist");
	const file = join(dir, "session-titles.json");
	const titles = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
	titles[sessionId] = title;
	mkdirSync(dir, { recursive: true });
	writeFileSync(file, JSON.stringify(titles, null, 2));
}

export function writeTranscript(
	capture: CaptureHome,
	step: CaptureTranscriptStep,
): void {
	const cwd = join(capture.reposDir, step.repo);
	const { sessionId, jsonl } = buildTranscript({
		cwd,
		prompt: step.prompt,
		reply: step.reply ?? [],
		startedAt: new Date(Date.now() - (step.ageMinutes ?? 0) * 60_000),
	});
	const dir = join(
		capture.home,
		".claude",
		"projects",
		claudeProjectDirName(cwd),
	);
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, `${sessionId}.jsonl`), jsonl);
	if (step.title) saveTitle(capture.home, sessionId, step.title);
}
