import { buildReviewerStdin } from "./buildReviewerStdin";
import type { ReviewPaths } from "./buildReviewPaths";
import type { MultiSpinner } from "./MultiSpinner";
import type { CodexPlan } from "./planCodexReviewer";
import type { ReviewerModels } from "./ReviewerModels";
import { runReviewers } from "./runReviewers";
import type { ReviewerResult } from "./runStreamingChild";
import { synthesiseAfterReviewers } from "./synthesiseAfterReviewers";
import { skipReason } from "./skipReason";

type Args = {
	paths: ReviewPaths;
	cachedClaude: ReviewerResult | null;
	codexPlan: CodexPlan;
	multi: MultiSpinner | undefined;
	models: ReviewerModels;
	strict: boolean;
};

export type AndSynthesiseOutcome = {
	ok: boolean;
	failures: ReviewerResult[];
	slots: ReviewerResult[];
};

function failed(results: ReviewerResult[]): ReviewerResult[] {
	return results.filter((r) => r.exitCode !== 0);
}

export async function runAndSynthesise(
	args: Args,
): Promise<AndSynthesiseOutcome> {
	const { paths, multi } = args;
	const { results, anyFresh } = await runReviewers(
		paths.reviewDir,
		paths.claudePath,
		paths.codexPath,
		buildReviewerStdin(paths.requestPath),
		{
			multi,
			codexPlan: args.codexPlan,
			cachedClaude: args.cachedClaude,
			models: args.models,
		},
	);
	const failures = failed(results);
	const reason = skipReason(results, failures, args.strict);
	if (reason) {
		console.error(reason);
		return { ok: false, failures, slots: results };
	}
	return synthesiseAfterReviewers({
		paths,
		results,
		failures,
		anyFresh,
		multi,
		slot: args.models.synthesis,
	});
}
