import type { Command } from "commander";
import { internalCommand } from "../../shared/internalCommand";
import { comment } from "./comment";
import { comments } from "./comments";
import { deleteCommentCmd } from "./deleteCommentCmd";

export function registerCommentCommands(cmd: Command): void {
	internalCommand(
		cmd
			.command("comment <id> <text>")
			.description("Add a comment to a backlog item")
			.action(comment),
		"backlog run phases and /refine",
	);

	cmd
		.command("comments <id>")
		.description("List comments and summaries for a backlog item")
		.action(comments);

	cmd
		.command("delete-comment <id> <comment-id>")
		.description("Delete a comment from a backlog item")
		.action(deleteCommentCmd);
}
