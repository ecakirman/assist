import { githubPullNumber } from "../../../../shared/githubPullNumber";
import { isAllowedPrArgs } from "../../../../shared/isAllowedPrArgs";
import { type GithubPlanError, resolveGithubClone } from "./resolveGithubClone";

export function planGithubReview(
	body: unknown,
	baseDir: string,
): { ok: true; cwd: string; assistArgs: string[] } | GithubPlanError {
	const { url, args } = (body ?? {}) as Record<string, unknown>;
	if (!isAllowedPrArgs(args))
		return { ok: false, status: 400, error: "Unsupported assist args" };
	const prNumber = typeof url === "string" ? githubPullNumber(url.trim()) : "";
	if (!prNumber)
		return { ok: false, status: 400, error: `Not a GitHub PR URL: ${url}` };
	const clone = resolveGithubClone(url, baseDir);
	if (!clone.ok) return clone;
	return { ok: true, cwd: clone.cwd, assistArgs: [...args, prNumber] };
}
