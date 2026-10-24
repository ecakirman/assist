import chalk from "chalk";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";

function savedMessage(subject: HighLevelOverlaySubject): string | undefined {
	const head = subject.headSha.slice(0, 7);
	if (subject.draft)
		return `Reopening the review left open for ${head} at ${subject.draft.savedAt}; pass --force to start fresh.`;
	if (subject.saved)
		return `Reopening the review saved for ${head} at ${subject.saved.reviewedAt} (${subject.saved.verdict}); pass --force to start fresh.`;
	return undefined;
}

export function announceSavedReview(
	subject: HighLevelOverlaySubject,
	force: boolean,
): void {
	const message = savedMessage(subject);
	if (message) console.log(chalk.dim(message));
	else if (force)
		console.log(
			chalk.dim(
				`Discarding any review saved for ${subject.headSha.slice(0, 7)} and starting fresh (--force).`,
			),
		);
}
