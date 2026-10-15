import { existsSync, unlinkSync } from "node:fs";
import type { CodexModelOverride } from "../litellm/buildCodexProviderArgs";
import { createCodexLineHandler } from "./createCodexLineHandler";
import { finaliseReviewerRun } from "./finaliseReviewerRun";
import type { SpinnerHandle } from "./MultiSpinner";
import { type ReviewerResult, runStreamingChild } from "./runStreamingChild";

type CodexReviewerSpec = {
	name: string;
	stdin: string;
	outputPath: string;
	override: CodexModelOverride;
	spinner?: SpinnerHandle;
};

function codexArgs(outputPath: string, modelArgs: string[]): string[] {
	return [
		"exec",
		...modelArgs,
		"--sandbox",
		"read-only",
		"--json",
		"--output-last-message",
		outputPath,
	];
}

export async function runCodexReviewer(
	spec: CodexReviewerSpec,
): Promise<ReviewerResult> {
	const { spinner, override } = spec;
	const command = "codex";
	const { state, onLine } = createCodexLineHandler(
		spec.name,
		spinner,
		override.model,
	);
	const result = await runStreamingChild({
		name: spec.name,
		command,
		model: override.model,
		args: codexArgs(spec.outputPath, override.args),
		stdin: spec.stdin,
		quiet: Boolean(spinner),
		...(override.args.length > 0 ? { env: override.env } : {}),
		onLine,
	});
	if (result.exitCode !== 0 && existsSync(spec.outputPath)) {
		unlinkSync(spec.outputPath);
	}
	const finalised = finaliseReviewerRun(
		{
			name: spec.name,
			command,
			model: override.model,
			outputPath: spec.outputPath,
		},
		spinner,
		result,
	);
	return state.usage ? { ...finalised, usage: state.usage } : finalised;
}
