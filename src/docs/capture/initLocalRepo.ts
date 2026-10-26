import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function initLocalRepo(dir: string, env: NodeJS.ProcessEnv): void {
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
