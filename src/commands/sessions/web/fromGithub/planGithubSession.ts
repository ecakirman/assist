import { type GithubPlanError, resolveGithubClone } from "./resolveGithubClone";

export function planGithubSession(
	body: unknown,
	baseDir: string,
	redirects?: Record<string, string>,
): { ok: true; cwd: string; prompt: string } | GithubPlanError {
	const { url, instructions } = (body ?? {}) as Record<string, unknown>;
	const clone = resolveGithubClone(url, baseDir, redirects);
	if (!clone.ok) return clone;
	const extra = typeof instructions === "string" ? instructions.trim() : "";
	const prompt = extra ? `${clone.url}\n\n${extra}` : clone.url;
	return { ok: true, cwd: clone.cwd, prompt };
}
