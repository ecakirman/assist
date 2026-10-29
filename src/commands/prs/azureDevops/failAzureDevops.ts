import { azCliProblem } from "../../review/azCliProblem";

function errorOutput(error: unknown): string {
	const stderr = (error as { stderr?: string | Buffer }).stderr?.toString();
	if (stderr?.trim()) return stderr.trim();
	return error instanceof Error ? error.message : String(error);
}

export function failAzureDevops(error: unknown): never {
	console.error(`Error: ${azCliProblem(error) ?? errorOutput(error)}`);
	process.exit(1);
}
