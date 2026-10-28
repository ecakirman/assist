import { azureDevopsRemote } from "./azureDevopsRemote";

type CliCommand = { file: string; args: string[] };

export type PrCliCommands = {
	headBranch: CliCommand & { parse: (stdout: string) => string | null };
	checkout: CliCommand;
};

const HEADS = "refs/heads/";

function branchFromRef(stdout: string): string | null {
	const ref = stdout.trim();
	return (ref.startsWith(HEADS) ? ref.slice(HEADS.length) : ref) || null;
}

export function prCliCommands(number: string, cwd: string): PrCliCommands {
	const azure = azureDevopsRemote(cwd);
	if (!azure)
		return {
			headBranch: {
				file: "gh",
				args: [
					"pr",
					"view",
					number,
					"--json",
					"headRefName",
					"-q",
					".headRefName",
				],
				parse: (stdout) => stdout.trim() || null,
			},
			checkout: { file: "gh", args: ["pr", "checkout", number] },
		};
	return {
		headBranch: {
			file: "az",
			args: [
				"repos",
				"pr",
				"show",
				"--id",
				number,
				"--org",
				`https://dev.azure.com/${azure.org}`,
				"--query",
				"sourceRefName",
				"-o",
				"tsv",
			],
			parse: branchFromRef,
		},
		checkout: { file: "az", args: ["repos", "pr", "checkout", "--id", number] },
	};
}
