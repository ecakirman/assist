import { describe, expect, it } from "vitest";
import { buildInboxScanArgs, parseInboxScanOutput } from "./runInboxScanClaude";

describe("buildInboxScanArgs", () => {
	const args = buildInboxScanArgs(new Date("2026-10-30T00:00:00Z"));
	const listAfter = (flag: string) => {
		const start = args.indexOf(flag) + 1;
		const end = args.findIndex((a, i) => i >= start && a.startsWith("--"));
		return args.slice(start, end);
	};

	it("allows only the read-only Gmail and Slack tools", () => {
		expect(listAfter("--allowedTools")).toEqual([
			"mcp__claude_ai_Gmail__search_threads",
			"mcp__claude_ai_Gmail__get_thread",
			"mcp__claude_ai_Slack__slack_search_public_and_private",
			"mcp__claude_ai_Slack__slack_read_thread",
		]);
	});

	it("disables built-in tools and denies anything not pre-approved", () => {
		expect(
			args.slice(args.indexOf("--tools"), args.indexOf("--tools") + 2),
		).toEqual(["--tools", ""]);
		expect(args[args.indexOf("--permission-mode") + 1]).toBe("dontAsk");
		expect(listAfter("--disallowedTools")).toContain(
			"mcp__claude_ai_Gmail__update_message_labels",
		);
	});
});

describe("parseInboxScanOutput", () => {
	it("returns the structured messages", () => {
		const messages = [
			{
				source: "slack",
				messageId: "D1:1.2",
				sender: "Sam",
				summary: "Asks when the PR lands",
				link: "https://slack.com/archives/D1/p12",
			},
		];
		expect(
			parseInboxScanOutput(
				JSON.stringify({ is_error: false, structured_output: { messages } }),
			),
		).toEqual(messages);
	});

	it("throws when the run failed", () => {
		expect(() =>
			parseInboxScanOutput(JSON.stringify({ is_error: true, result: "boom" })),
		).toThrow("boom");
	});
});
