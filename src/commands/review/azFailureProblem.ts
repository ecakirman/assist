export const azProblems = {
	missing:
		"Azure CLI (az) not found; install it (https://aka.ms/azure-cli) and run az login.",
	extension:
		"The azure-devops az extension is not installed; run az extension add --name azure-devops.",
	login: "az is not logged in; run az login.",
};

const EXTENSION_PATTERNS = [
	/requires the extension azure-devops/i,
	/'(?:repos|devops)' is misspelled or not recognized/i,
	/'(?:repos|devops)' is not in the 'az' command group/i,
];

const LOGIN_PATTERNS = [/\baz login\b/i, /you need to run the login command/i];

export function azFailureProblem(error: unknown): string | null {
	if ((error as NodeJS.ErrnoException | undefined)?.code === "ENOENT")
		return azProblems.missing;
	const stderr =
		(error as { stderr?: string | Buffer } | undefined)?.stderr?.toString() ??
		"";
	if (EXTENSION_PATTERNS.some((pattern) => pattern.test(stderr)))
		return azProblems.extension;
	if (LOGIN_PATTERNS.some((pattern) => pattern.test(stderr)))
		return azProblems.login;
	return null;
}
