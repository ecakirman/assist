import type { Command } from "commander";
import { internalCommand } from "../shared/internalCommand";
import { fixed as prsFixed } from "./prs/fixed";
import { readBodyArgument } from "./prs/readBodyArgument";
import { reply as prsReply } from "./prs/reply";
import { wontfix as prsWontfix } from "./prs/wontfix";

export function registerPrsThreadReplies(
	prsCommand: Command,
	calledBy: string,
): void {
	internalCommand(
		prsCommand
			.command("fixed <comment-id> <sha>")
			.description("Reply with commit link and resolve thread")
			.action((commentId: string, sha: string) => {
				prsFixed(Number.parseInt(commentId, 10), sha);
			}),
		calledBy,
	);

	internalCommand(
		prsCommand
			.command("wontfix <comment-id> <reason>")
			.description(
				"Reply with reason and resolve thread (reason of - reads it from stdin)",
			)
			.action(async (commentId: string, reason: string) => {
				await prsWontfix(
					Number.parseInt(commentId, 10),
					await readBodyArgument(reason),
				);
			}),
		calledBy,
	);

	internalCommand(
		prsCommand
			.command("reply <comment-id> <body>")
			.description(
				"Reply to a comment thread without resolving it (body of - reads it from stdin)",
			)
			.action(async (commentId: string, body: string) => {
				await prsReply(
					Number.parseInt(commentId, 10),
					await readBodyArgument(body),
				);
			}),
		calledBy,
	);
}
