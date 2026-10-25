import type { Command } from "commander";

export type InternalCommand = Command & { internalCalledBy?: string };

export function internalCommand(command: Command, calledBy: string): Command {
	(command as InternalCommand).internalCalledBy = calledBy;
	return command;
}
