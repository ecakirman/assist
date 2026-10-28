import type { Command } from "commander";
import { internalCommand } from "../shared/internalCommand";
import { prompts } from "./prompts/prompts";

export function registerPrompts(program: Command): void {
	internalCommand(
		program
			.command("prompts")
			.description("Show top denied tool calls by frequency")
			.action(prompts),
		"/prompts",
	);
}
