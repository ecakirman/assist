import { execFileSync } from "node:child_process";

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

export function azCliProblem(): string | null {
	if (runAz(["version"]) === "missing")
		return "Azure CLI (az) not found; install it (https://aka.ms/azure-cli) and run az login.";
	if (runAz(["extension", "show", "--name", "azure-devops"]) !== "ok")
		return "The azure-devops az extension is not installed; run az extension add --name azure-devops.";
	if (runAz(["account", "show"]) !== "ok")
		return "az is not logged in; run az login.";
	return null;
}
