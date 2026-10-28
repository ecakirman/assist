import chalk from "chalk";
import type { StalePrBranch } from "./clearStalePrBranch";
import { gitSyncOrNull } from "../sessions/daemon/worktree/git";
import { azCliProblem } from "./azCliProblem";
import type { PrCliCommands } from "./prCliCommands";

export function failCheckout(
	number: string,
	headRef: string | null,
	stale: StalePrBranch,
	from: string | null,
	checkout: PrCliCommands["checkout"],
): never {
	if (headRef && from && from !== headRef && currentBranch() === headRef)
		gitSyncOrNull(process.cwd(), ["checkout", "--quiet", from]);
	if (headRef && stale === "local-work")
		console.error(
			chalk.red(
				`Local branch ${headRef} has commits that are not on the remote and cannot fast-forward to PR #${number}'s head; push or reset ${headRef}, then retry.`,
			),
		);
	const problem = checkout.file === "az" ? azCliProblem() : null;
	if (problem) console.error(chalk.red(problem));
	console.error(
		chalk.red(`${checkout.file} ${checkout.args.join(" ")} failed; aborting.`),
	);
	process.exit(1);
}

function currentBranch(): string | null {
	return gitSyncOrNull(process.cwd(), ["rev-parse", "--abbrev-ref", "HEAD"]);
}
