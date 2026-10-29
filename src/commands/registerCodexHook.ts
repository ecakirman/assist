import type { Command } from "commander";
import { internalCommand } from "../shared/internalCommand";
import { codexHook } from "./codexHook";

export function registerCodexHook(program: Command): void {
	internalCommand(
		program
			.command("codex-hook")
			.description(
				"Codex hook: auto-approves read-only CLI commands (PreToolUse/PermissionRequest) and reports session status (running/waiting) to the sessions daemon",
			)
			.action(() => codexHook()),
		"Codex's hooks",
	);
}
