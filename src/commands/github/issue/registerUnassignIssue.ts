import type { Command } from "commander";
import { internalCommand } from "../../../shared/internalCommand";
import { unassignIssue } from "./unassignIssue";

export function registerUnassignIssue(issueCommand: Command): void {
	const unassignCommand = issueCommand
		.command("unassign <number>")
		.description("Remove yourself from a GitHub issue's assignees")
		.option(
			"-R, --repo <owner/repo>",
			"Target repository (defaults to the current repo)",
		)
		.action(unassignIssue);
	internalCommand(unassignCommand, "agents removing an assignee");
}
