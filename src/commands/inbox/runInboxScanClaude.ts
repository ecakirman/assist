import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { z } from "zod";
import { buildInboxScanPrompt } from "./buildInboxScanPrompt";
import { type FlaggedMessage, inboxScanSchema } from "./inboxScanSchema";
import { inboxScanTools } from "./inboxScanTools";

const execFileAsync = promisify(execFile);

export function buildInboxScanArgs(since: Date): string[] {
	return [
		"-p",
		"--tools",
		"",
		"--permission-mode",
		"dontAsk",
		"--allowedTools",
		...inboxScanTools.allowed,
		"--disallowedTools",
		...inboxScanTools.denied,
		"--no-session-persistence",
		"--output-format",
		"json",
		"--json-schema",
		JSON.stringify(z.toJSONSchema(inboxScanSchema)),
		"--",
		buildInboxScanPrompt(since),
	];
}

export function parseInboxScanOutput(stdout: string): FlaggedMessage[] {
	const result = JSON.parse(stdout) as {
		is_error?: boolean;
		result?: string;
		structured_output?: unknown;
	};
	if (result.is_error)
		throw new Error(`Inbox scan failed: ${result.result ?? "unknown error"}`);
	return inboxScanSchema.parse(result.structured_output).messages;
}

export async function runInboxScanClaude(
	since: Date,
): Promise<FlaggedMessage[]> {
	const { stdout } = await execFileAsync("claude", buildInboxScanArgs(since), {
		encoding: "utf8",
		windowsHide: true,
		timeout: 20 * 60_000,
		maxBuffer: 64 * 1024 * 1024,
	});
	return parseInboxScanOutput(stdout);
}
