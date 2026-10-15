import { resolveRepoLocation } from "../../../backlog/resolveRepoLocation";
import { parseGithubOrigin } from "./parseGithubOrigin";

export type GithubPlanError = { ok: false; status: number; error: string };

export function resolveGithubClone(
	url: unknown,
	baseDir: string,
): { ok: true; url: string; cwd: string } | GithubPlanError {
	if (typeof url !== "string" || !url.trim())
		return { ok: false, status: 400, error: "Missing url" };
	const trimmed = url.trim();
	const origin = parseGithubOrigin(trimmed);
	if (!origin)
		return { ok: false, status: 400, error: `Not a GitHub repo URL: ${url}` };
	const { cwd } = resolveRepoLocation(origin, undefined, baseDir);
	if (!cwd)
		return {
			ok: false,
			status: 404,
			error: `${origin.replace("github.com/", "")} is not cloned under ${baseDir}`,
		};
	return { ok: true, url: trimmed, cwd };
}
