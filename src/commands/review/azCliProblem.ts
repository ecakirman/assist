import { execFileSync } from "node:child_process";
import { azFailureProblem, azProblems } from "./azFailureProblem";

function runAz(args: string[]): "ok" | "missing" | "failed" {
	try {
		execFileSync("az", args, { stdio: "ignore" });
		return "ok";
	} catch (error) {
		return (error as NodeJS.ErrnoException).code === "ENOENT"
			? "missing"
			: "failed";
	}
}

export function azCliProblem(error?: unknown): string | null {
	const fromFailure = error === undefined ? null : azFailureProblem(error);
	if (fromFailure) return fromFailure;
	if (runAz(["version"]) === "missing") return azProblems.missing;
	if (runAz(["extension", "show", "--name", "azure-devops"]) !== "ok")
		return azProblems.extension;
	if (runAz(["account", "show"]) !== "ok") return azProblems.login;
	return null;
}
