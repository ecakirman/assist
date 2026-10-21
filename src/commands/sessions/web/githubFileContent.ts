import { execFile } from "node:child_process";
import type { IncomingMessage, ServerResponse } from "node:http";
import { promisify } from "node:util";
import { respondJson } from "../../../shared/web";
import { ghFailure } from "../../../shared/ghFailure";

const execFileAsync = promisify(execFile);

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const REPO = /^[\w.-]+\/[\w.-]+$/;
const SHA = /^[0-9a-f]{7,40}$/i;

function validPath(path: string): boolean {
	return (
		path.length > 0 &&
		!path.startsWith("/") &&
		path.split("/").every((part) => part !== "" && part !== "..")
	);
}

export async function githubFileContent(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	const params = new URL(req.url ?? "/", "http://localhost").searchParams;
	const repo = params.get("repo") ?? "";
	const sha = params.get("sha") ?? "";
	const path = params.get("path") ?? "";
	if (!REPO.test(repo) || !SHA.test(sha) || !validPath(path)) {
		respondJson(res, 400, { error: "Invalid repo, sha or path" });
		return;
	}
	const encodedPath = path.split("/").map(encodeURIComponent).join("/");
	try {
		const { stdout } = await execFileAsync(
			"gh",
			[
				"api",
				"-H",
				"Accept: application/vnd.github.raw",
				`repos/${repo}/contents/${encodedPath}?ref=${sha}`,
			],
			{ encoding: "utf8", windowsHide: true, maxBuffer: MAX_FILE_BYTES },
		);
		respondJson(res, 200, { content: stdout });
	} catch (error) {
		respondJson(res, 502, { error: ghFailure(error) });
	}
}
