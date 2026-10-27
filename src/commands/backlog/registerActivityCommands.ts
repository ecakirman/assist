import type { Command } from "commander";
import { internalCommand } from "../../shared/internalCommand";
import { addActivity } from "./addActivity";
import { recordSession } from "./recordSession";
import { recordSlack } from "./recordSlack";

export function registerActivityCommands(cmd: Command): void {
	internalCommand(
		cmd
			.command("add-activity <id> <kind> <ref>")
			.description(
				"Attach an activity ref (branch|commit|pr|slack|session) to a backlog item",
			)
			.option("--title <title>", "Title metadata for the ref")
			.option("--url <url>", "URL metadata (auto-filled for branch/commit)")
			.option("--state <state>", "State metadata for the ref")
			.action(addActivity),
		"/draft and /bug",
	);

	internalCommand(
		cmd
			.command("record-slack <url>")
			.description(
				"Attach a Slack thread permalink to the current session's backlog item",
			)
			.option("--title <title>", "PR title to label the ref with")
			.action(recordSlack),
		"/prs-slack",
	);

	internalCommand(
		cmd
			.command("record-session <id>")
			.description(
				"Attach the Claude session this command runs inside to a backlog item",
			)
			.option(
				"--session <sessionId>",
				"Session id to attach instead of the detected one",
			)
			.action(recordSession),
		"an agent asked to attach its conversation to an item",
	);
}
