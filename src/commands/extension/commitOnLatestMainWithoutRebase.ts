import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gitOutput } from "./gitOutput";

export function commitOnLatestMainWithoutRebase(
	path: string,
	blob: string,
	message: string,
): string {
	const dir = mkdtempSync(join(tmpdir(), "update-manifest-"));
	const env = { GIT_INDEX_FILE: join(dir, "index") };
	try {
		gitOutput(["read-tree", "origin/main"], env);
		gitOutput(
			["update-index", "--add", "--cacheinfo", `100644,${blob},${path}`],
			env,
		);
		const tree = gitOutput(["write-tree"], env);
		return gitOutput(["commit-tree", tree, "-p", "origin/main", "-m", message]);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}
