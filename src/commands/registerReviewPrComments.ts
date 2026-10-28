import type { Command } from "commander";
import { reviewPrComments } from "./reviewPrComments";

export function registerReviewPrComments(
	program: Command,
	resumeFlag: string,
): void {
	program
		.command("review-pr-comments")
		.argument("[number]", "PR number to check out first")
		.description("Launch Claude in /review-pr-comments mode (single session)")
		.option(
			"--announce",
			"After every comment thread is processed, announce the PR in Slack via /prs-slack <number> --no-confirm (requires a PR number)",
		)
		.option(
			"--auto",
			"Accept Claude's own recommendation for each thread without asking, falling back to asking only for threads it cannot confidently decide",
		)
		.option(
			"--batch",
			"Collect a decision for every thread before changing anything, then apply each fix as its own commit, push once and resolve every thread (cannot be combined with --auto)",
		)
		.option("--resume-session <id>", resumeFlag)
		.action(
			(
				number,
				opts: {
					announce?: boolean;
					auto?: boolean;
					batch?: boolean;
					resumeSession?: string;
				},
			) =>
				reviewPrComments(number, {
					announce: opts.announce,
					auto: opts.auto,
					batch: opts.batch,
					resumeSessionId: opts.resumeSession,
				}),
		);
}
