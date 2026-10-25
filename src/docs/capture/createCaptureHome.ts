import { execFileSync } from "node:child_process";
import {
	copyFileSync,
	cpSync,
	mkdirSync,
	mkdtempSync,
	realpathSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { captureRepos } from "../captureSetupStepSchema";
import { docsPaths } from "../docsPaths";
import { isolatedEnv } from "./isolatedEnv";

const SANDBOX_REPO = "https://github.com/staff0rd/sandbox.git";

export type CaptureHome = {
	home: string;
	reposDir: string;
	sandbox: string;
	env: NodeJS.ProcessEnv;
};

function socketPathSafeTempDir(): string {
	return process.platform === "win32" ? tmpdir() : "/tmp";
}

function initLocalRepo(dir: string, env: NodeJS.ProcessEnv): void {
	const name = dir.split(/[\\/]/).pop();
	mkdirSync(dir, { recursive: true });
	writeFileSync(join(dir, "README.md"), `# ${name}\n`);
	const git = (...args: string[]) =>
		execFileSync("git", args, { cwd: dir, env, stdio: "ignore" });
	git("init", "--quiet", "--initial-branch", "main");
	git("add", ".");
	git("commit", "--quiet", "--message", "Initial commit");
	git("remote", "add", "origin", `https://github.com/example/${name}.git`);
}

export function createCaptureHome(databaseUrl: string): CaptureHome {
	const home = realpathSync(
		mkdtempSync(join(socketPathSafeTempDir(), "assist-docs-")),
	);
	const bin = join(home, "bin");
	cpSync(docsPaths.captureBin, bin, { recursive: true });
	const base = isolatedEnv(home);
	const env = {
		...base,
		PATH: [bin, base.PATH].filter(Boolean).join(delimiter),
		ASSIST_DATABASE_URL: databaseUrl,
	};
	copyFileSync(docsPaths.captureConfig, join(home, ".assist.yml"));
	writeFileSync(
		join(home, ".gitconfig"),
		"[user]\n\tname = Sandbox\n\temail = sandbox@example.com\n",
	);
	const reposDir = join(home, "repos");
	const sandbox = join(reposDir, "sandbox");
	execFileSync("git", ["clone", "--quiet", SANDBOX_REPO, sandbox], {
		env,
		stdio: "inherit",
	});
	for (const repo of captureRepos)
		if (repo !== "sandbox") initLocalRepo(join(reposDir, repo), env);
	return { home, reposDir, sandbox, env };
}
