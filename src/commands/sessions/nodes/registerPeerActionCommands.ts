import type { Command } from "commander";
import { internalCommand } from "../../../shared/internalCommand";
import { restartNode } from "./restartNode";
import { updateNode } from "./updateNode";

export function registerPeerActionCommands(nodes: Command, calledBy: string) {
	internalCommand(
		nodes
			.command("restart <name>")
			.description(
				"Restart a linked node's daemon and/or web server, wait for its link to reconnect and print its version",
			)
			.option("--target <target>", "daemon, webserver or both", "both")
			.action(restartNode),
		calledBy,
	);

	internalCommand(
		nodes
			.command("update <name>")
			.description(
				"Run assist update on a linked node, restart it, wait for its link to reconnect and print its version",
			)
			.action((name: string) => updateNode(name)),
		calledBy,
	);
}
