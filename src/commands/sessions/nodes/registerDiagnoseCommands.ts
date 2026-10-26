import type { Command } from "commander";
import { internalCommand } from "../../../shared/internalCommand";
import { doctorNodes } from "./doctorNodes";
import { nodeLogs } from "./nodeLogs";

export function registerDiagnoseCommands(nodes: Command, calledBy: string) {
	internalCommand(
		nodes
			.command("doctor [name]")
			.description(
				"Probe each hop of every link (or one) in order and stop at the first failure with a remediation",
			)
			.option("--json", "Output as JSON")
			.action((name: string | undefined, _options, command: Command) =>
				doctorNodes(name, command.optsWithGlobals()),
			),
		calledBy,
	);

	internalCommand(
		nodes
			.command("logs <name>")
			.description("Tail a linked node's daemon.log through its web server")
			.option("-n, --lines <lines>", "Number of lines", "200")
			.option("--json", "Output as JSON")
			.action((name: string, _options, command: Command) =>
				nodeLogs(name, command.optsWithGlobals()),
			),
		calledBy,
	);
}
