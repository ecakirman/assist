import { execFileSync } from "node:child_process";
import { ghFailure } from "../../../shared/ghFailure";

export function fetchFileAtSha(
	repo: string,
	sha: string,
	path: string,
): string {
	const encodedPath = path.split("/").map(encodeURIComponent).join("/");
	try {
		return execFileSync(
			"gh",
			[
				"api",
				"-H",
				"Accept: application/vnd.github.raw",
				`repos/${repo}/contents/${encodedPath}?ref=${sha}`,
			],
			{
				encoding: "utf8",
				maxBuffer: 64 * 1024 * 1024,
				stdio: ["ignore", "pipe", "pipe"],
			},
		);
	} catch (error) {
		throw new Error(
			`Could not read ${path} at PR head ${sha.slice(0, 7)}: ${ghFailure(error)}`,
		);
	}
}
