import type { Command } from "commander";
import { internalCommand } from "../../shared/internalCommand";
import { phaseDone as backlogPhaseDone } from "./phaseDone";
import { plan as backlogPlan } from "./plan";

export function registerPlanCommands(cmd: Command): void {
	cmd
		.command("plan <id>")
		.description("Display the plan for a backlog item")
		.action(backlogPlan);

	internalCommand(
		cmd
			.command("phase-done <id> <phase> <summary>")
			.description("Signal that a plan phase is complete")
			.action(backlogPhaseDone),
		"the agent running each phase of a backlog run",
	);
}
