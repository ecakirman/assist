import { join } from "node:path";
import type { CaptureBacklogItemStep } from "../captureSetupStepSchema";
import type { CaptureHome } from "./createCaptureHome";
import { runAssist } from "./runAssist";
import { proposeItem } from "./proposeItem";

export function seedBacklogItem(
	capture: CaptureHome,
	step: CaptureBacklogItemStep,
): void {
	const cwd = join(capture.reposDir, step.repo ?? "sandbox");
	const id = proposeItem(capture, cwd, step);
	const assist = (...args: string[]) => runAssist(capture, args, cwd);
	(step.phaseSummaries ?? []).forEach((summary, index) => {
		assist("backlog", "phase-done", id, String(index + 1), summary);
	});
	(step.subtasks ?? []).forEach(({ title, status }, index) => {
		assist("backlog", "add-subtask", id, "--title", title);
		if (status && status !== "todo")
			assist("backlog", "subtask-status", id, String(index + 1), status);
	});
	for (const { kind, ref, title, url, state } of step.activity ?? [])
		assist(
			"backlog",
			"add-activity",
			id,
			kind,
			ref,
			...(title ? ["--title", title] : []),
			...(url ? ["--url", url] : []),
			...(state ? ["--state", state] : []),
		);
	for (const comment of step.comments ?? [])
		assist("backlog", "comment", id, comment);
	if (step.status) assist("backlog", "set-status", id, step.status);
	if (step.starred) assist("backlog", "star", id);
}
