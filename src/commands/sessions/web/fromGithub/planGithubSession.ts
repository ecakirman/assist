import {
	type GithubAssistMode,
	isGithubAssistMode,
} from "../../../../shared/githubAssistModes";
import { linkPrompt } from "./linkPrompt";
import { type GithubPlanError, resolveGithubClone } from "./resolveGithubClone";

export function planGithubSession(
	body: unknown,
	baseDir: string,
	redirects?: Record<string, string>,
):
	| { ok: true; cwd: string; prompt: string; mode?: GithubAssistMode }
	| GithubPlanError {
	const { url, instructions, mode } = (body ?? {}) as Record<string, unknown>;
	if (mode !== undefined && !isGithubAssistMode(mode))
		return { ok: false, status: 400, error: `Unknown mode: ${mode}` };
	const clone = resolveGithubClone(url, baseDir, redirects);
	if (!clone.ok) return clone;
	const prompt = linkPrompt(clone.url, instructions);
	return { ok: true, cwd: clone.cwd, prompt, ...(mode && { mode }) };
}
