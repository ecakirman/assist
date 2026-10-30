import { basename } from "node:path";
import {
	type GithubAssistMode,
	isGithubAssistMode,
} from "../../../../shared/githubAssistModes";
import { linkPrompt } from "./linkPrompt";
import { listClones } from "./listClones";
import type { GithubPlanError } from "./resolveGithubClone";

function isHttpUrl(url: string): boolean {
	return URL.canParse(url) && /^https?:$/.test(new URL(url).protocol);
}

export function planLinkSession(
	body: unknown,
	baseDir: string,
):
	| { ok: true; cwd: string; prompt: string; mode?: GithubAssistMode }
	| GithubPlanError {
	const { url, repo, instructions, mode } = (body ?? {}) as Record<
		string,
		unknown
	>;
	if (mode !== undefined && !isGithubAssistMode(mode))
		return { ok: false, status: 400, error: `Unknown mode: ${mode}` };
	if (typeof url !== "string" || !isHttpUrl(url.trim()))
		return { ok: false, status: 400, error: "Missing or invalid url" };
	if (typeof repo !== "string" || !repo.trim())
		return { ok: false, status: 400, error: "No repo picked" };
	const cwd = listClones(baseDir).find((dir) => basename(dir) === repo.trim());
	if (!cwd)
		return {
			ok: false,
			status: 404,
			error: `${repo} is not cloned under ${baseDir}`,
		};
	const prompt = linkPrompt(url.trim(), instructions);
	return { ok: true, cwd, prompt, ...(mode && { mode }) };
}
