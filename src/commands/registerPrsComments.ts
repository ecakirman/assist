import type { Command } from "commander";
import { internalCommand } from "../shared/internalCommand";
import { comment as prsComment } from "./prs/comment";
import { listComments as prsListComments } from "./prs/listComments";
import { printComments as prsPrintComments } from "./prs/listComments/printComments";
import { readBodyArgument } from "./prs/readBodyArgument";
import { registerPrsThreadReplies } from "./registerPrsThreadReplies";

const reviewComments = "/review-pr-comments";

export function registerPrsComments(prsCommand: Command): void {
	internalCommand(
		prsCommand
			.command("list-comments")
			.description("List all comments on the current branch's pull request")
			.action(() => {
				prsListComments().then(prsPrintComments);
			}),
		reviewComments,
	);

	registerPrsThreadReplies(prsCommand, reviewComments);

	internalCommand(
		prsCommand
			.command("comment <path> <line> <body>")
			.description(
				"Add a line comment to the pending review (body of - reads it from stdin)",
			)
			.action(async (path: string, line: string, body: string) => {
				await prsComment(
					path,
					Number.parseInt(line, 10),
					await readBodyArgument(body),
				);
			}),
		"/comment and /forward-comments",
	);
}
