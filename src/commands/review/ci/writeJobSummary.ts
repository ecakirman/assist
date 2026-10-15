import { appendFileSync, readFileSync } from "node:fs";
import { buildReviewSummary } from "../buildReviewSummary";
import type { PrDiffRef } from "../postReviewToPr";
import type { ReviewerResult } from "../runStreamingChild";
import { selectPostableFindings } from "../selectPostableFindings";
import { buildTokenUsageTable } from "./buildTokenUsageTable";

export function writeJobSummary(
	synthesisPath: string,
	prInfo: PrDiffRef,
	summaryPath: string | undefined,
	slots: ReviewerResult[],
): void {
	if (!summaryPath) return;
	const markdown = readFileSync(synthesisPath, "utf8");
	const { unanchored } = selectPostableFindings(markdown, prInfo);
	const usageTable = buildTokenUsageTable(slots.map((slot) => slot.usage));
	appendFileSync(
		summaryPath,
		`${buildReviewSummary(markdown, unanchored)}\n\n${usageTable}\n`,
	);
}
