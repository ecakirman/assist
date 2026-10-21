import { resolveRepoLocation } from "../../../backlog/resolveRepoLocation";
import { findCloneByOrigin } from "./findCloneByOrigin";
import { parseGithubOrigin } from "./parseGithubOrigin";

export type GithubPlanError = { ok: false; status: number; error: string };

export function resolveGithubClone(
	url: unknown,
	baseDir: string,
	redirects: Record<string, string> = {},
): { ok: true; url: string; cwd: string } | GithubPlanError {
	if (typeof url !== "string" || !url.trim())
		return { ok: false, status: 400, error: "Missing url" };
	const trimmed = url.trim();
	const origin = parseGithubOrigin(trimmed);
	if (!origin)
		return { ok: false, status: 400, error: `Not a GitHub repo URL: ${url}` };
	const repo = origin.replace("github.com/", "");
	const target = redirects[repo] ?? repo;
	const targetOrigin = `github.com/${target}`;
	const cwd =
		resolveRepoLocation(targetOrigin, undefined, baseDir).cwd ??
		findCloneByOrigin(targetOrigin, baseDir);
	if (!cwd)
		return {
			ok: false,
			status: 404,
			error: `${target} is not cloned under ${baseDir}`,
		};
	return { ok: true, url: trimmed, cwd };
}
