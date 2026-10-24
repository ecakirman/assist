import { readFileSync } from "node:fs";
import { createProgram } from "../../createProgram";
import { docsPaths } from "../docsPaths";
import { collectClaudeCommands } from "./collectClaudeCommands";
import { collectCliCommands } from "./collectCliCommands";
import { collectConfigKeys } from "./collectConfigKeys";
import { collectWebRoutes } from "./collectWebRoutes";
import type { InventoryItem } from "./InventoryItem";

export function collectDocsInventory(): InventoryItem[] {
	return [
		...collectCliCommands(createProgram()),
		...collectClaudeCommands(docsPaths.claudeDir),
		...collectConfigKeys(),
		...collectWebRoutes(readFileSync(docsPaths.appRoutes, "utf8")),
	];
}
