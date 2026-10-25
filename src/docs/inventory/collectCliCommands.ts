import type { Command } from "commander";
import type { InternalCommand } from "../../shared/internalCommand";
import type { InventoryItem } from "./InventoryItem";

function hasOwnAction(command: Command): boolean {
	return Boolean(
		(command as unknown as { _actionHandler?: unknown })._actionHandler,
	);
}

function walk(command: Command, path: string[], out: InventoryItem[]): void {
	if (command.commands.length === 0 || hasOwnAction(command)) {
		const { internalCalledBy } = command as InternalCommand;
		out.push({
			id: `cli:${path.join(" ")}`,
			description: command.description(),
			...(internalCalledBy && { internalCalledBy }),
		});
	}
	for (const child of command.commands)
		walk(child, [...path, child.name()], out);
}

export function collectCliCommands(program: Command): InventoryItem[] {
	const out: InventoryItem[] = [];
	for (const child of program.commands) walk(child, [child.name()], out);
	return out;
}
