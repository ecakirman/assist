import { promptConfirm } from "../../shared/promptConfirm";
import { setSessionStatus } from "../sessions/setSessionStatus";
import { carriedUnanchoredFindings } from "./carriedUnanchoredFindings";
import type { LineBoundFinding, UnanchoredFinding } from "./partitionFindings";
import { postFindings } from "./postFindings";
import { buildReviewBody } from "./buildReviewBody";
import { submitReview } from "./submitReview";

type PostAndMaybeSubmitOptions = {
	prompt: boolean;
	submit: boolean;
	ciFooter?: string;
};

export type PostOutcome = {
	posted: number;
	submitted: boolean;
};

async function decideSubmit(
	options: PostAndMaybeSubmitOptions,
): Promise<boolean> {
	if (!options.prompt) return options.submit;
	await setSessionStatus("waiting");
	try {
		return await promptConfirm("Submit the pending review?", options.submit);
	} finally {
		await setSessionStatus("running");
	}
}

export async function postAndMaybeSubmit(
	lineBound: LineBoundFinding[],
	unanchored: UnanchoredFinding[],
	markdown: string,
	options: PostAndMaybeSubmitOptions,
): Promise<PostOutcome> {
	const result = await postFindings(lineBound);
	const failedSuffix = result.failed > 0 ? `, ${result.failed} failed` : "";
	console.log(`Posted ${result.posted} comment(s)${failedSuffix}.`);
	const carried = carriedUnanchoredFindings(unanchored);
	if (result.posted === 0 && carried.length === 0 && !options.ciFooter)
		return { posted: 0, submitted: false };
	const shouldSubmit = await decideSubmit(options);
	if (shouldSubmit) {
		const submitted = submitReview(
			buildReviewBody(markdown, unanchored, options.ciFooter),
			result,
		);
		if (!submitted && options.ciFooter)
			throw new Error("the review could not be submitted to the PR");
		return { posted: result.posted, submitted };
	}
	console.log("Leaving the review unsubmitted.");
	return { posted: result.posted, submitted: false };
}
