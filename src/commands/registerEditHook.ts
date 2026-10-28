import type { Command } from "commander";
import { internalCommand } from "../shared/internalCommand";
import { editHook } from "./editHook";

export function registerEditHook(program: Command): void {
	internalCommand(
		program
			.command("edit-hook")
			.description(
				"PreToolUse hook that blocks edits to the maintainability override marker and edits that introduce code comments",
			)
			.action(() => {
				editHook();
			}),
		"the PreToolUse hook on file edits",
	);
}
