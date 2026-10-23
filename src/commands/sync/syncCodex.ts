import * as path from "node:path";
import { harnesses, isHarnessAvailable } from "../../shared/harnesses";
import { installHarnessCommands } from "./installHarnessCommands";
import { pruneSkills } from "./pruneSkills";
import type { PruneOptions } from "./pruneTarget";
import { reportPrune } from "./reportPrune";
import { syncCodexHooks } from "./syncCodexHooks";
import { commandToSkill } from "./commandToSkill";

export function syncCodex(claudeDir: string, options?: PruneOptions): void {
	if (!isHarnessAvailable("codex")) return;

	const { total, names } = installHarnessCommands(
		claudeDir,
		harnesses.codex,
		commandToSkill,
	);

	syncCodexHooks(path.join(claudeDir, "..", "codex", "config.toml"));

	console.log(`Synced ${total} skill(s) to ~/.codex/skills`);

	if (!options?.prune) return;

	const force = options.force ?? false;

	reportPrune(
		"~/.codex/skills",
		pruneSkills(path.join(harnesses.codex.homeDir, "skills"), names, { force }),
		force,
	);
}
