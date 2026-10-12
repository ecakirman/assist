import * as path from "node:path";
import { loadConfig } from "../../../shared/loadConfig";
import { findPackageJsonWithVerifyScripts } from "../../../shared/readPackageJson";
import { resolveRunConfigs } from "../../../shared/resolveRunConfigs";
import { runConfigBaseDir } from "../../../shared/runConfigBaseDir";
import { shellQuote } from "../../../shared/shellQuote";
import { getRootEntries } from "./getRootEntries";
import type { VerifyEntry } from "./VerifyEntry";
import { getRepoRootEntries } from "./getRepoRootEntries";

function buildFullCommand(command: string, args?: string[]): string {
	return [shellQuote(command), ...(args ?? []).map(shellQuote)].join(" ");
}

function getRunEntries(): VerifyEntry[] {
	const { run } = loadConfig();
	const baseDir = runConfigBaseDir();
	const configs = resolveRunConfigs(run, baseDir);
	return configs
		.filter((r) => r.name.startsWith("verify:"))
		.map((r) => ({
			name: r.name,
			fullCommand: buildFullCommand(r.command, r.args),
			cwd: r.cwd ? path.resolve(baseDir, r.cwd) : undefined,
			env: r.env,
			filter: r.filter,
			quiet: r.quiet,
		}));
}

function getPackageJsonEntries(): VerifyEntry[] {
	const result = findPackageJsonWithVerifyScripts(process.cwd());
	if (!result) return [];
	const cwd = path.dirname(result.packageJsonPath);
	return result.verifyScripts.map((script) => ({
		name: script,
		fullCommand: `npm run ${script}`,
		cwd,
	}));
}

function normalizeRoot(root: string): string {
	return path.posix.normalize(root.replaceAll("\\", "/")).replace(/\/+$/, "");
}

export function resolveEntries(): VerifyEntry[] {
	const roots = (loadConfig().verify?.roots ?? []).map(normalizeRoot);
	if (roots.length === 0) {
		return [...getRunEntries(), ...getPackageJsonEntries()];
	}
	const baseDir = runConfigBaseDir();
	return [
		...getRunEntries(),
		...getRootEntries(baseDir, roots),
		...getRepoRootEntries(baseDir, roots),
	];
}
