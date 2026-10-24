import { execFileSync } from "node:child_process";
import {
	copyFileSync,
	mkdtempSync,
	realpathSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { docsPaths } from "../docsPaths";
import { isolatedEnv } from "./isolatedEnv";

const SANDBOX_REPO = "https://github.com/staff0rd/sandbox.git";

export type CaptureHome = {
	home: string;
	sandbox: string;
	env: NodeJS.ProcessEnv;
};

function socketPathSafeTempDir(): string {
	return process.platform === "win32" ? tmpdir() : "/tmp";
}

export function createCaptureHome(databaseUrl: string): CaptureHome {
	const home = realpathSync(
		mkdtempSync(join(socketPathSafeTempDir(), "assist-docs-")),
	);
	const env = { ...isolatedEnv(home), ASSIST_DATABASE_URL: databaseUrl };
	copyFileSync(docsPaths.captureConfig, join(home, ".assist.yml"));
	writeFileSync(
		join(home, ".gitconfig"),
		"[user]\n\tname = Sandbox\n\temail = sandbox@example.com\n",
	);
	const sandbox = join(home, "repos", "sandbox");
	execFileSync("git", ["clone", "--quiet", SANDBOX_REPO, sandbox], {
		env,
		stdio: "inherit",
	});
	return { home, sandbox, env };
}
