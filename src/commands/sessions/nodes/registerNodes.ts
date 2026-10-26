import type { Command } from "commander";
import { configHelp } from "../../../shared/configHelp";
import { internalCommand } from "../../../shared/internalCommand";
import { listNodes } from "./listNodes";
import { nodesConfigHelp } from "./nodesConfigHelp";
import { registerDiagnoseCommands } from "./registerDiagnoseCommands";
import { registerLinkCommand } from "./registerLinkCommand";
import { registerPeerActionCommands } from "./registerPeerActionCommands";
import { unlinkNode } from "./unlinkNode";

const calledBy = "agents managing linked nodes";

export function registerNodes(sessions: Command): void {
	const cmd = internalCommand(
		sessions
			.command("nodes")
			.description("List this node and every linked node with its link state")
			.option("--json", "Output as JSON")
			.action(listNodes),
		calledBy,
	);

	internalCommand(registerLinkCommand(cmd), calledBy);

	internalCommand(
		cmd
			.command("unlink <name>")
			.description("Remove a linked node")
			.action(unlinkNode),
		calledBy,
	);

	registerDiagnoseCommands(cmd, calledBy);
	registerPeerActionCommands(cmd, calledBy);

	configHelp(cmd, nodesConfigHelp);
}
