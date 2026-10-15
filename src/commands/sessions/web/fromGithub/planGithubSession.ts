import { resolveRepoLocation } from "../../../backlog/resolveRepoLocation";
import { parseGithubOrigin } from "./parseGithubOrigin";

type GithubSessionPlan =
	| { ok: true; cwd: string; prompt: string }
	| { ok: false; status: number; error: string };

export function planGithubSession(
	body: unknown,
	baseDir: string,
): GithubSessionPlan {
	const { url, instructions } = (body ?? {}) as Record<string, unknown>;
	if (typeof url !== "string" || !url.trim())
		return { ok: false, status: 400, error: "Missing url" };
	const origin = parseGithubOrigin(url.trim());
	if (!origin)
		return { ok: false, status: 400, error: `Not a GitHub repo URL: ${url}` };
	const { cwd } = resolveRepoLocation(origin, undefined, baseDir);
	if (!cwd)
		return {
			ok: false,
			status: 404,
			error: `${origin.replace("github.com/", "")} is not cloned under ${baseDir}`,
		};
	const extra = typeof instructions === "string" ? instructions.trim() : "";
	const prompt = extra ? `${url.trim()}\n\n${extra}` : url.trim();
	return { ok: true, cwd, prompt };
}
