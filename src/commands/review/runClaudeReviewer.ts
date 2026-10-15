import { writeFileSync } from "node:fs";
import type { CodexModelOverride } from "../litellm/buildCodexProviderArgs";
import { createClaudeLineHandler } from "./createClaudeLineHandler";
import { finaliseReviewerRun } from "./finaliseReviewerRun";
import type { SpinnerHandle } from "./MultiSpinner";
import { type ReviewerResult, runStreamingChild } from "./runStreamingChild";

type ClaudeReviewerSpec = {
	name: string;
	reviewDir: string;
	stdin: string;
	outputPath: string;
	spinner?: SpinnerHandle;
	override?: CodexModelOverride;
};

export async function runClaudeReviewer(
	spec: ClaudeReviewerSpec,
): Promise<ReviewerResult> {
	const { spinner, override } = spec;
	const command = "claude";
	const { state, onLine } = createClaudeLineHandler(
		spec.name,
		spinner,
		override?.model,
	);
	const result = await runStreamingChild({
		name: spec.name,
		command,
		model: override?.model,
		args: [
			"-p",
			"--add-dir",
			spec.reviewDir,
			"--output-format",
			"stream-json",
			"--verbose",
			...(override?.args ?? []),
		],
		stdin: spec.stdin,
		quiet: Boolean(spinner),
		...(override ? { env: override.env } : {}),
		onLine,
	});
	if (result.exitCode === 0 && state.finalText)
		writeFileSync(spec.outputPath, state.finalText);
	const finalised = finaliseReviewerRun(
		{ ...spec, command, model: override?.model },
		spinner,
		result,
	);
	return state.usage ? { ...finalised, usage: state.usage } : finalised;
}
