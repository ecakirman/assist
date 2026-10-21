import { getCurrentPrNumber } from "../../prs/shared";
import { announceSavedReview } from "./announceSavedReview";
import { gatherHighLevelSubject } from "./gatherHighLevelSubject";
import { openHighLevelOverlay } from "./openHighLevelOverlay";
import { printHighLevelChecklist } from "./printHighLevelChecklist";

function resolvePrNumber(number: string | undefined): number {
	if (number === undefined) return getCurrentPrNumber();
	const parsed = Number(number);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		console.error(`Error: \`${number}\` is not a pull request number.`);
		process.exit(1);
	}
	return parsed;
}

function gatherSubject(prNumber: number, force: boolean) {
	try {
		return gatherHighLevelSubject(prNumber, force);
	} catch (error) {
		console.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`,
		);
		process.exit(1);
	}
}

export async function runHighLevelReview(
	number: string | undefined,
	options: { force?: boolean } = {},
): Promise<void> {
	const force = options.force === true;
	const subject = gatherSubject(resolvePrNumber(number), force);
	announceSavedReview(subject, force);
	const sessionId = process.env.ASSIST_SESSION_ID;
	if (process.env.ASSIST_SESSION !== "1" || !sessionId)
		return printHighLevelChecklist(subject);
	await openHighLevelOverlay(sessionId, subject);
}
