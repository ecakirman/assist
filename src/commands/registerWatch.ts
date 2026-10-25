import type { Command } from "commander";
import { internalCommand } from "../shared/internalCommand";
import { registerWatchWait } from "./watch/registerWatchWait";
import { simulateDivergence } from "./watch/simulateDivergence";
import { watchLoop } from "./watch/watchLoop";
import { watchReport } from "./watch/watchReport";

export function registerWatch(program: Command): void {
	const watchCommand = program
		.command("watch")
		.description("Wait on upstream movement for the current branch");

	registerWatchWait(watchCommand);

	internalCommand(
		watchCommand
			.command("loop")
			.description(
				"Run assist watch wait --pull --build as a fresh child per lap, relaunching after exit 0, 2 or 4 or a signal kill, and exit with the child's code on 1, 3 or 130",
			)
			.action(() => watchLoop()),
		"debugging auto-update",
	);

	internalCommand(
		watchCommand
			.command("simulate-divergence")
			.description(
				"Make the next assist watch wait poll in this repo exit 3 as if the branch had diverged, to test the watcher's divergence escalation",
			)
			.action(() => simulateDivergence()),
		"debugging auto-update",
	);

	internalCommand(
		watchCommand
			.command("report")
			.description(
				"Print the built version, the last 10 commits as a markdown table, the restarts the new commits make necessary, and whether ~/.claude needs a sync",
			)
			.option(
				"--from <sha>",
				"Mark commits reachable from HEAD but not <sha> as new, and derive the restart and sync advice from the files they changed",
			)
			.action((options: { from?: string }) => watchReport(options)),
		"debugging auto-update",
	);
}
