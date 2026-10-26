import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { captureRepos } from "../captureSetupStepSchema";
import { initLocalRepo } from "./initLocalRepo";

const SANDBOX_REPO = "https://github.com/staff0rd/sandbox.git";

export function cloneCaptureRepos(reposDir: string, env: NodeJS.ProcessEnv) {
	const sandbox = join(reposDir, "sandbox");
	execFileSync("git", ["clone", "--quiet", SANDBOX_REPO, sandbox], {
		env,
		stdio: "inherit",
	});
	for (const repo of captureRepos)
		if (repo !== "sandbox") initLocalRepo(join(reposDir, repo), env);
	return sandbox;
}
