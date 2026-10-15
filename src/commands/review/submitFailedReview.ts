import { appendCiFooter } from "./appendCiFooter";
import type { ReviewerResult } from "./runStreamingChild";
import { submitBodyOnlyReview } from "./submitBodyOnlyReview";

function describeFailures(failures: ReviewerResult[]): string {
	if (failures.length === 0) return "The review did not complete.";
	const steps = failures.map((f) => f.name.replace("-", " ")).join(" and ");
	return `The review did not complete: ${steps} failed.`;
}

export function submitFailedReview(
	failures: ReviewerResult[],
	ciFooter: string,
	runUrl?: string,
): void {
	const lines = [
		"## Code review failed",
		"",
		`${describeFailures(failures)} No findings were posted.`,
	];
	if (runUrl) lines.push("", `See the [workflow run](${runUrl}) for details.`);
	submitBodyOnlyReview(appendCiFooter(lines.join("\n"), ciFooter));
}
