import type { ReviewerModels } from "./ReviewerModels";

export type ReviewPrOptions = {
	prompt?: boolean;
	submit?: boolean;
	force?: boolean;
	refine?: boolean;
	apply?: boolean;
	backlog?: boolean;
	verbose?: boolean;
	addressComments?: boolean;
	announce?: boolean;
	ci?: {
		models: ReviewerModels;
		summaryPath?: string;
		footer: string;
		runUrl?: string;
	};
};
