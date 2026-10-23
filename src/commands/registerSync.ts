import type { Command } from "commander";
import { configHelp } from "../shared/configHelp";
import { rootConfigHelp } from "./rootConfigHelp";
import { sync } from "./sync";

export function registerSync(program: Command): void {
	const syncCommand = program
		.command("sync")
		.description(
			"Install commands as ~/.claude/skills/<name>/SKILL.md, so they take precedence over a project skill of the same name, and delete any ~/.claude/commands/<name>.md an earlier sync wrote; when codex is detected, also install commands as ~/.codex/skills/<name>/SKILL.md and register the assist codex-hook in ~/.codex/config.toml, which auto-approves read-only commands and injects the repo's composed advice on SessionStart; when pi is detected, also install commands as ~/.pi/agent/prompts/<name>.md and install the assist extensions into ~/.pi/agent/extensions, which gate permissions and inject the same advice. No global instructions file is written — every harness composes its own from assist advise at session start, and any ~/.claude/CLAUDE.md, ~/.codex/AGENTS.md or ~/.pi/agent/AGENTS.md an earlier sync left behind is named so you can remove it. With --prune, also report commands in those target dirs that sync did not write, and with --prune --force remove them",
		)
		.option("-y, --yes", "Overwrite settings.json without prompting")
		.option(
			"--prune",
			"After syncing, list commands in the target dirs whose name is not in the repo's claude/commands/*.md set (every ~/.claude/commands/*.md counts, since sync no longer writes there); subdirectories and non-.md files are listed separately and never removed",
		)
		.option(
			"--force",
			"With --prune, remove the listed orphaned commands; a claude or codex skill directory is removed only when SKILL.md is its sole content. Errors without --prune",
		)
		.action((options) => {
			if (options.force && !options.prune) {
				console.error("--force requires --prune.");
				process.exit(1);
			}
			return sync(options);
		});

	configHelp(syncCommand, rootConfigHelp.sync);
}
