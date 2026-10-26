import { createHash } from "node:crypto";
import { buildHighLevelStructure } from "../../commands/review/highLevel/buildHighLevelStructure";
import { collectHighLevelTests } from "../../commands/review/highLevel/collectHighLevelTests";
import { evaluateHighLevelChecks } from "../../commands/review/highLevel/evaluateHighLevelChecks";
import { highLevelPreviewMetadata } from "../../commands/review/highLevel/highLevelPreviewMetadata";
import { highLevelPreviewPayload } from "../../commands/review/highLevel/highLevelPreviewPayload";
import { selectCriticalDiffs } from "../../commands/review/highLevel/selectCriticalDiffs";
import type { CaptureHighLevelReviewStep } from "../captureSetupStepSchema";
import { captureHighLevelConfig } from "./captureHighLevelConfig";
import type { CapturePreview } from "./holdPreviewOpen";
import { highLevelFile } from "./highLevelFile";

const REPO = "staff0rd/sandbox";

export function buildHighLevelCapturePreview(
	step: CaptureHighLevelReviewStep,
): CapturePreview {
	const config = captureHighLevelConfig(step);
	const files = step.files.map((file) => highLevelFile(file, step.prNumber));
	const sources = new Map(step.files.map((f) => [f.path, f.content ?? ""]));
	const subject = {
		repo: REPO,
		prNumber: step.prNumber,
		title: step.title,
		headRef: step.headRef,
		headSha: createHash("sha1").update(JSON.stringify(step)).digest("hex"),
		checks: evaluateHighLevelChecks({
			body: step.body,
			linkedIssues: step.linkedIssues ?? [],
			mergeable: "MERGEABLE",
			baseRef: "main",
			changedFiles: files.map((file) => file.path),
			config,
		}),
		structure: buildHighLevelStructure(files),
		criticalDiffs: selectCriticalDiffs(files, config.criticalPaths),
		criticalPaths: config.criticalPaths,
		tests: collectHighLevelTests(
			files,
			config.testPaths,
			(path) => sources.get(path) ?? "",
		),
		testPaths: config.testPaths,
		collapsedPaths: config.collapsedPaths,
	};
	return {
		title: `${REPO}#${step.prNumber} — ${step.title}`,
		body: JSON.stringify(highLevelPreviewPayload(subject)),
		prNumber: step.prNumber,
		kind: "high-level-review",
		metadata: highLevelPreviewMetadata(subject),
	};
}
